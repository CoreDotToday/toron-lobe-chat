'use client';

import { useOrganization, useSession, useUser } from '@clerk/nextjs';
import classNames from 'classnames';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import { Dot } from '../../icons';
import './prism.css';

declare global {
  interface Window {
    Prism: any;
  }
}

function Toggle(props: { checked: boolean; onChange: () => void; disabled: boolean }) {
  return (
    <div className="flex items-center justify-end flex-1">
      <button
        type="button"
        disabled={props.disabled}
        onClick={props.onChange}
        className={classNames({
          'rounded-l-lg py-2 px-4 border-solid border border-gray-300 transition text-sm font-semibold':
            true,
          'bg-gray-100': !props.checked,
          'bg-gray-50 text-gray-500 cursor-not-allowed': props.disabled,
        })}
      >
        List
      </button>
      <button
        type="button"
        disabled={props.disabled}
        onClick={props.onChange}
        className={classNames({
          'rounded-r-lg py-2 px-4 border-solid border border-gray-300 -ml-[1px] transition text-sm font-semibold':
            true,
          'bg-gray-100': props.checked,
          'bg-gray-50 text-gray-500 cursor-not-allowed': props.disabled,
        })}
      >
        JSON
      </button>
    </div>
  );
}

function JSONOutput(props: { json: any }) {
  useEffect(() => {
    if (window.Prism) {
      console.log(`highlighting`);
      window.Prism.highlightAll();
    }
  }, []);

  return (
    <pre className="px-8 sm:px-6 text-black text-sm">
      <code className="language-json">{JSON.stringify(props.json, null, 2)}</code>
    </pre>
  );
}

export function UserDetails() {
  const { isLoaded, user } = useUser();
  const [jsonOutput, setJsonOutput] = useState(false);

  return (
    <div
      className="bg-white overflow-hidden sm:rounded-lg"
      style={{
        boxShadow: `0px 20px 24px -4px rgba(16, 24, 40, 0.08)`,
      }}
    >
      <div className="flex p-8">
        <h3 className="text-xl leading-6 font-semibold text-gray-900 my-auto">사용자 정보</h3>
      </div>
      {isLoaded && user ? (
        jsonOutput ? (
          <div className="overflow-scroll max-h-96 pb-6">
            <JSONOutput json={user} />
          </div>
        ) : (
          <div className="pb-6 max-h-96">
            <dl>
              {user.firstName && (
                <div className="px-8 py-2">
                  <dt className="text-sm font-semibold mb-1">이름</dt>
                  <dd className="mt-1 text-sm text-gray-600 sm:mt-0 sm:col-span-2">
                    {user.firstName}
                  </dd>
                </div>
              )}
              {user.lastName && (
                <div className="px-8 py-2">
                  <dt className="text-sm font-semibold mb-1">성</dt>
                  <dd className="mt-1 text-sm text-gray-600 sm:mt-0 sm:col-span-2">
                    {user.lastName}
                  </dd>
                </div>
              )}
              <div className="px-8 py-2">
                <dt className="text-sm font-semibold mb-1">이메일 주소</dt>
                <dd className="mt-1 text-sm text-gray-600 sm:mt-0 sm:col-span-2">
                  {user.emailAddresses.map((email) => (
                    <div key={email.id} className="flex gap-2 mb-1">
                      {email.emailAddress}
                      {user.primaryEmailAddressId === email.id && (
                        <span className="text-xs bg-primary-50 text-primary-700 rounded-2xl px-2 font-medium pt-[2px]">
                          Primary
                        </span>
                      )}
                    </div>
                  ))}
                </dd>
              </div>
              {user.imageUrl && (
                <div className="px-8 py-2">
                  <dt className="text-sm font-semibold mb-1">개인 프로필 이미지</dt>
                  <dd className="mt-1 text-sm text-gray-600 sm:mt-0 sm:col-span-2">
                    <img src={user.imageUrl} className="rounded-full w-12 h-12" />
                  </dd>
                </div>
              )}
            </dl>
          </div>
        )
      ) : (
        <div className="text-gray-700 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          Loading user data...
        </div>
      )}
    </div>
  );
}

export function SessionDetails() {
  const { isLoaded, session } = useSession();
  const [jsonOutput, setJsonOutput] = useState(false);

  return (
    <div
      className="bg-white shadow overflow-hidden sm:rounded-lg"
      style={{
        boxShadow: `0px 20px 24px -4px rgba(16, 24, 40, 0.08)`,
      }}
    >
      <div className="flex p-8">
        <h3 className="text-xl leading-6 font-semibold text-gray-900 my-auto">접속 기록</h3>
      </div>
      {isLoaded && session ? (
        jsonOutput ? (
          <div className="overflow-scroll max-h-96 pb-6">
            <JSONOutput
              json={{
                ...session,
                user: undefined,
              }}
            />
          </div>
        ) : (
          <div className="pb-6 max-h-96">
            <dl>
              <div className="px-8 py-2">
                <dt className="text-sm font-semibold mb-1">상태</dt>
                <dd className="mt-1 text-sm text-gray-600 sm:mt-0 sm:col-span-2">
                  {session.status === `active` && (
                    <span className="text-xs bg-success-50 text-success-700 flex w-min gap-1 px-2 py-[1px] rounded-2xl font-medium">
                      <div className="m-auto">
                        <Dot />
                      </div>
                      Active
                    </span>
                  )}
                </dd>
              </div>
              <div className="px-8 py-2">
                <dt className="text-sm font-semibold mb-1">최근 활동</dt>
                <dd className="mt-1 text-sm text-gray-600 sm:mt-0 sm:col-span-2">
                  {session.lastActiveAt.toLocaleString()}
                </dd>
              </div>
              <div className="px-8 py-2">
                <dt className="text-sm font-semibold mb-1">로그인 유효 기간</dt>
                <dd className="mt-1 text-sm text-gray-600 sm:mt-0 sm:col-span-2">
                  {session.expireAt.toLocaleString()}
                </dd>
              </div>
            </dl>
          </div>
        )
      ) : (
        <div className="text-gray-700 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          Loading user data...
        </div>
      )}
    </div>
  );
}

export function OrgDetails() {
  const { isLoaded, organization } = useOrganization();
  const [jsonOutput, setJsonOutput] = useState(false);

  return (
    <div
      className="bg-white shadow overflow-hidden sm:rounded-lg"
      style={{
        boxShadow: `0px 20px 24px -4px rgba(16, 24, 40, 0.08)`,
      }}
    >
      <div className="flex p-8">
        <h3 className="text-xl leading-6 font-semibold text-gray-900 my-auto">조직 정보</h3>
        <Toggle
          checked={jsonOutput}
          onChange={() => setJsonOutput(!jsonOutput)}
          disabled={!(isLoaded && organization)}
        />
      </div>
      {isLoaded ? (
        organization ? (
          jsonOutput ? (
            <div className="overflow-scroll max-h-96 pb-6">
              <JSONOutput json={organization} />
            </div>
          ) : (
            <div className="pb-6 max-h-96">
              <dl>
                <div className="px-8 py-2">
                  <dt className="text-sm font-semibold mb-1">조직 이름</dt>
                  <dd className="mt-1 text-sm text-gray-600 sm:mt-0 sm:col-span-2">
                    {organization.name}
                  </dd>
                </div>
                <div className="px-8 py-2">
                  <dt className="text-sm font-semibold mb-1">멤버의 수</dt>
                  <dd className="mt-1 text-sm text-gray-600 sm:mt-0 sm:col-span-2">
                    {organization.membersCount}
                  </dd>
                </div>
                <div className="px-8 py-2">
                  <dt className="text-sm font-semibold mb-1">초대 수락 대기 중인 멤버의 수</dt>
                  <dd className="mt-1 text-sm text-gray-600 sm:mt-0 sm:col-span-2">
                    {organization.pendingInvitationsCount}
                  </dd>
                </div>
                <div className="px-8 py-2">
                  <dt className="text-sm font-semibold mb-1">조직 이미지</dt>
                  <dd className="mt-1 text-sm text-gray-600 sm:mt-0 sm:col-span-2">
                    <Image
                      className="rounded"
                      src={organization.imageUrl}
                      alt={`Logo for ${organization.name}`}
                      width={48}
                      height={48}
                    />
                  </dd>
                </div>
              </dl>
            </div>
          )
        ) : (
          <div className="text-gray-700 px-8 pb-5 text-sm">
            현재 조직을 선택하지 않으셨습니다.
            <br />
            토론을 위한 조직을 상단 메뉴에서 선택해주세요.
          </div>
        )
      ) : (
        <div className="text-gray-700 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          Loading organization data...
        </div>
      )}
    </div>
  );
}
