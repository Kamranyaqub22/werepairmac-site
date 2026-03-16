import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0f2b5b',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '40px',
        }}
      >
        <span
          style={{
            color: 'white',
            fontSize: '72px',
            fontWeight: 900,
            letterSpacing: '-2px',
            fontFamily: 'sans-serif',
          }}
        >
          WR
        </span>
      </div>
    ),
    { ...size }
  );
}
