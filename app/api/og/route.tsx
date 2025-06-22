import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

const interBold = fetch(
  new URL('./Inter-Bold.ttf', import.meta.url)
).then((res) => res.arrayBuffer()).catch(() => null)

const interRegular = fetch(
  new URL('./Inter-Regular.ttf', import.meta.url)
).then((res) => res.arrayBuffer()).catch(() => null)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Get parameters
    const title = searchParams.get('title') || 'Untitled Workflow'
    const author = searchParams.get('author') || 'Anonymous'
    const type = searchParams.get('type') || 'workflow'
    const difficulty = searchParams.get('difficulty') || 'intermediate'
    const time = searchParams.get('time') || ''

    const fontDataBold = await interBold
    const fontDataRegular = await interRegular

    // Define colors for workflow types
    const typeColors: Record<string, { bg: string; text: string }> = {
      greenfield: { bg: '#86efac', text: '#166534' },
      refactoring: { bg: '#93c5fd', text: '#1e40af' },
      debugging: { bg: '#fca5a5', text: '#991b1b' },
      testing: { bg: '#c4b5fd', text: '#6b21a8' },
      workflow: { bg: '#d1d5db', text: '#374151' }
    }

    // Define colors for difficulty
    const difficultyColors: Record<string, { bg: string; text: string }> = {
      beginner: { bg: '#f3f4f6', text: '#374151' },
      intermediate: { bg: '#fef3c7', text: '#92400e' },
      advanced: { bg: '#fed7aa', text: '#9a3412' }
    }

    const typeColor = typeColors[type] || typeColors.workflow
    const difficultyColor = difficultyColors[difficulty] || difficultyColors.intermediate

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#ffffff',
            backgroundImage: 'linear-gradient(to bottom right, #f0f9ff, #e0f2fe)',
          }}
        >
          {/* Top border accent */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '8px',
              background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
            }}
          />

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '80px',
              paddingTop: '100px',
              height: '100%',
            }}
          >
            {/* Tags */}
            <div
              style={{
                display: 'flex',
                gap: '16px',
                marginBottom: '32px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px 16px',
                  backgroundColor: typeColor.bg,
                  color: typeColor.text,
                  borderRadius: '9999px',
                  fontSize: '24px',
                  fontWeight: 600,
                  textTransform: 'capitalize',
                }}
              >
                {type}
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px 16px',
                  backgroundColor: difficultyColor.bg,
                  color: difficultyColor.text,
                  borderRadius: '9999px',
                  fontSize: '24px',
                  fontWeight: 600,
                  textTransform: 'capitalize',
                }}
              >
                {difficulty}
              </div>
              {time && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '8px 16px',
                    backgroundColor: '#e5e7eb',
                    color: '#4b5563',
                    borderRadius: '9999px',
                    fontSize: '24px',
                  }}
                >
                  ⏱ {time}
                </div>
              )}
            </div>

            {/* Title */}
            <h1
              style={{
                fontSize: '72px',
                fontWeight: 700,
                color: '#111827',
                lineHeight: 1.1,
                marginBottom: '24px',
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                textWrap: 'balance',
              }}
            >
              {title}
            </h1>

            {/* Bottom section */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              {/* Author */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                }}
              >
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: '#3b82f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '28px',
                    color: 'white',
                    fontWeight: 700,
                  }}
                >
                  {author[0].toUpperCase()}
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div
                    style={{
                      fontSize: '20px',
                      color: '#6b7280',
                    }}
                  >
                    by
                  </div>
                  <div
                    style={{
                      fontSize: '28px',
                      color: '#111827',
                      fontWeight: 600,
                    }}
                  >
                    {author}
                  </div>
                </div>
              </div>

              {/* Logo/Brand */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    fontSize: '32px',
                    fontWeight: 700,
                    color: '#3b82f6',
                  }}
                >
                  LLM Workflows
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: fontDataBold && fontDataRegular ? [
          {
            name: 'Inter',
            data: fontDataBold,
            style: 'normal',
            weight: 700,
          },
          {
            name: 'Inter',
            data: fontDataRegular,
            style: 'normal',
            weight: 400,
          },
        ] : [],
      }
    )
  } catch (e: any) {
    console.log(`${e.message}`)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}