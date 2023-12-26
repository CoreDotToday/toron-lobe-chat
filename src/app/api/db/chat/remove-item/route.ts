import { UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { currentUser } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

import { ddbDocClient } from '@/app/api/db/ddbDocClient';

export async function PATCH(req: Request) {
  const currentUserData = await currentUser();

  if (!currentUserData) {
    return NextResponse.error();
  }

  try {
    const url = new URL(req.url, `http://${req.headers.get('host')}`);
    const key = url.searchParams.get('key');
    const activeTopicId = url.searchParams.get('activeTopicId');

    if (!key) {
      return NextResponse.json({ message: 'Key is required' }, { status: 400 });
    }

    let sk = `CHAT#${key}`;
    // key가 'LobeChat_Chat'이고 activeTopicId가 있을 때만 sk 수정
    if (key === 'LobeChat_Chat' && activeTopicId) {
      sk += `@${activeTopicId}`;
    }

    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: {
        pk: `USER#${currentUserData.id}`,
        sk,
      },
      UpdateExpression: 'set deleted = :d',
      ExpressionAttributeValues: {
        ':d': true,
      },
    };

    await ddbDocClient.send(new UpdateCommand(params));

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.error();
  }
}
