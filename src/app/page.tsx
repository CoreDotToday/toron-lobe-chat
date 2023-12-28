import Image from 'next/image';
import Link from 'next/link';

import componentsImg from './assets/components.svg';
import './home.css';
import { DownArrow, RightArrow } from './icons';

export default function Home() {
  return (
    <main className="">
      <article className="grid lg:grid-cols-2">
        <div className="px-8 py-20 md:px-20 lg:py-48">
          <h1 className="text-5xl font-semibold text-transparent md:text-6xl gradient">
            Discuss with Toron AI
          </h1>
          <p className="mt-2 text-lg">
            새로운 학습의 차원으로 초대합니다. Toron.AI에서 수업에서 배운 내용을 토론하고, AI 튜터와
            함께 성장하세요.
          </p>
          <div className="flex gap-2 mt-8">
            <Link
              href="/dashboard"
              className="flex content-center gap-2 px-4 py-2 font-semibold text-white transition-colors duration-200 rounded-lg bg-primary-600 hover:bg-primary-700"
            >
              시작하기
              <div className="m-auto">
                <RightArrow />
              </div>
            </Link>
            <a
              className="flex gap-2 px-4 py-2 font-semibold text-gray-600 transition duration-100 rounded-lg hover:text-gray-800"
              href="#features"
            >
              사례보기
              <div className="m-auto">
                <DownArrow />
              </div>
            </a>
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <Image src={componentsImg} alt="Clerk embeddable components" />
        </div>
      </article>
      <article className="px-8 py-12 bg-black bg-opacity-5 md:px-20 md:py-24" id="features">
        <h2 className="text-3xl font-semibold">
          다양한 시각에서 세상을 바라보는 통찰력을 얻으세요
        </h2>
        <p className="mt-2">
          간단한 호기심에서 복잡한 이론까지, 모든 질문에 대한 자유로운 탐구. 묻기 어려웠던 멍청한
          질문들도 환영합니다. 언제나 당신의 지적 여정을 지원하는 AI 튜터가 함께합니다. (
          <a href="https://core.today" className="font-medium text-primary-600 hover:underline">
            메뉴얼 보기
          </a>
          )
        </p>
        <div className="grid gap-8 mt-8 lg:grid-cols-3">
          <div className="flex flex-col h-56 gap-1 p-8 bg-white shadow-lg rounded-2xl">
            <h3 className="text-lg font-medium">자유로운 대화</h3>
            <p className="text-gray-700">
              개념 이해부터 생뚱맞은 질문까지, 자유롭게 대화하며 이해의 폭을 넓히세요.
            </p>
            <div className="grow"></div>
            <a
              href="https://clerk.com/docs/component-reference/overview?utm_source=vercel-template&utm_medium=template_repos&utm_campaign=nextjs_template"
              className="text-primary-600 cta hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              대화 방법
              <span className="arrow">-&gt;</span>
            </a>
          </div>
          <div className="flex flex-col h-56 gap-1 p-8 bg-white shadow-lg rounded-2xl">
            <h3 className="text-lg font-medium">개인 맞춤형 피드백</h3>
            <p className="text-gray-700">
              AI가 제공하는 맞춤형 피드백을 통해 학습의 정확성과 효율성을 높이세요.
            </p>
            <div className="grow"></div>
            <a
              href="https://clerk.com/docs/reference/clerk-react/useuser?utm_source=vercel-template&utm_medium=template_repos&utm_campaign=nextjs_template"
              className="text-primary-600 cta hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              Personalized Feedback <span className="arrow">-&gt;</span>
            </a>
          </div>
          <div className="flex flex-col h-56 gap-1 p-8 bg-white shadow-lg rounded-2xl">
            <h3 className="text-lg font-medium">심층적 토론</h3>
            <p className="text-gray-700">
              다양한 주제에 대한 깊이 있는 토론을 AI 튜터와 진행하여 지식을 확장하세요.
            </p>
            <div className="grow"></div>
            <a
              href="https://clerk.com/docs/organizations/overview?utm_source=vercel-template&utm_medium=template_repos&utm_campaign=nextjs_template"
              className="text-primary-600 cta hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              Deeply Discussion <span className="arrow">-&gt;</span>
            </a>
          </div>
        </div>
      </article>
    </main>
  );
}
