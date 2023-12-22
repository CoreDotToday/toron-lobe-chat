'use client';

const handleClick = async () => {
  await fetch('/api/user', {
    method: 'POST',
  });
};

export default function Test() {
  return (
    <button type="button" onClick={handleClick}>
      버튼
    </button>
  );
}
