# -*- coding: utf-8 -*-

from mongoengine.queryset.visitor import Q

from models import BidNotice

import datetime

def get_notice_pagination(type_id, page_id, per_page):
    # 为了解决order by排序时内存溢出的问题，document的meta定义增加了index
    if type_id == '0' or type_id is None:
        return BidNotice.objects(). \
            order_by("-published_date", "-timestamp"). \
            paginate(page=page_id, per_page=per_page)
    else:
        return BidNotice.objects(type_id=type_id). \
            order_by("-published_date", "-timestamp"). \
            paginate(page=page_id, per_page=per_page)

def get_records_group_by_published_date(days_before=-7):
    k, v = [], []
    now = datetime.datetime.utcnow() + datetime.timedelta(hours=8)  # TimeZone 8
    for t0 in _get_days_list(now, days_before):
        t1 = t0 + datetime.timedelta(days=1)
        records = BidNotice.objects(Q(published_date__lte=t1) & Q(published_date__gte=t0)).count()
        k.append(t0.strftime('%Y-%m-%d'))
        v.append(records)
    return k, v

def get_records_group_by_timestamp(days_before=-7):
    k, v = [], []
    now = datetime.datetime.utcnow() + datetime.timedelta(hours=8)  # TimeZone 8
    for t0 in _get_days_list(now, days_before):
        t1 = t0 + datetime.timedelta(days=1)
        records = BidNotice.objects(Q(timestamp__lte=t1) & Q(timestamp__gte=t0)).count()
        k.append(t0.strftime('%Y-%m-%d'))
        v.append(records)
    return k, v

def get_records_group_by_source_ch():
    k, v = [], []
    cursor = BidNotice.objects().aggregate(
        {"$group": {"_id": "$source_ch", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    )
    for doc in cursor:
        k.append(doc['_id'])
        v.append(doc['count'])
    return k, v

def get_records_group_by_notice_type():
    k, v = [], []
    cursor = BidNotice.objects().aggregate(
        {"$group":
            {"_id": "$notice_type", "count":
                {"$sum": 1}
                }
            }
    )
    for doc in cursor:
        k.append(doc['_id'])
        v.append(doc['count'])
    return k, v

"""
Function: 获得t0为基准的UTCTime日期序列数组，时间元素固定为0h0m0s，并按升序排列
    days_delta为正数时，［t0, t0+1day...］; 为负数时，［...,t0-1day,t0］
"""
def _get_days_list(base_time, days_delta):
    arr = []
    t0 = datetime.datetime(base_time.year, base_time.month, base_time.day)
    if days_delta > 0:
        for i in range(0, days_delta+1):
            t = t0 + datetime.timedelta(days=i)
            arr.append(t)
    else:
        for i in range(days_delta, 1):
            t = t0 + datetime.timedelta(days=i)
            arr.append(t)
    return arr