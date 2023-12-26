// get-item/route.ts
import { GetCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { currentUser } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

import { ddbDocClient } from '@/app/api/db/ddbDocClient';

export async function GET(req: Request) {
  const currentUserData = await currentUser();

  if (!currentUserData) {
    return NextResponse.error();
  }

  try {
    const url = new URL(req.url, `http://${req.headers.get('host')}`);
    const key = url.searchParams.get('key');
    const version = url.searchParams.get('version');

    if (!key) {
      return NextResponse.json({ message: 'Key is required' }, { status: 400 });
    }

    let sk;
    let item;

    if (version) {
      // version이 제공된 경우
      sk = `CHAT#${key}@${version}`;
      const getItemParams = {
        TableName: process.env.DYNAMODB_TABLE_NAME,
        Key: {
          pk: `USER#${currentUserData.id}`,
          sk,
        },
      };
      const response = await ddbDocClient.send(new GetCommand(getItemParams));
      item = response.Item;
    } else {
      // version이 제공되지 않은 경우 최신 버전 조회
      const queryLatestVersionParams = {
        TableName: process.env.DYNAMODB_TABLE_NAME,
        KeyConditionExpression: 'pk = :pk and begins_with(sk, :sk)',
        ExpressionAttributeValues: {
          ':pk': `USER#${currentUserData.id}`,
          ':sk': `CHAT#${key}@`,
        },
        ScanIndexForward: false, // 최신 항목부터 정렬
        Limit: 1, // 하나만 가져옴
      };
      const queryResponse = await ddbDocClient.send(new QueryCommand(queryLatestVersionParams));
      item = queryResponse.Items?.[0];
    }

    return item
      ? NextResponse.json(item)
      : NextResponse.json({ message: 'Item not found' }, { status: 404 });
  } catch {
    return NextResponse.error();
  }
}
