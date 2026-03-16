import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
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
          borderRadius: '6px',
        }}
      >
        <span
          style={{
            color: 'white',
            fontSize: '14px',
            fontWeight: 900,
            letterSpacing: '-0.5px',
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
