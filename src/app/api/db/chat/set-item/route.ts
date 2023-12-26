// set-item/route.ts
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { currentUser } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

import { ddbDocClient } from '@/app/api/db/ddbDocClient';

export async function POST(req: Request) {
  const currentUserData = await currentUser();

  if (!currentUserData) {
    return NextResponse.error();
  }
  try {
    const body = await req.text();
    const { key, data, version } = JSON.parse(body);

    let sk = `CHAT#${key}@${version}`;

    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Item: { pk: `USER#${currentUserData.id}`, sk, ...data },
    };

    await ddbDocClient.send(new PutCommand(params));

    return NextResponse.json({
      ok: true,
    });
  } catch {
    return NextResponse.error();
  }
}
