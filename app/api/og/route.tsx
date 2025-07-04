import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

// Removed custom fonts to reduce Edge Function size

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Get parameters
    const title = searchParams.get('title') || 'Untitled Workflow'
    const author = searchParams.get('author') || 'Anonymous'
    const type = searchParams.get('type') || 'workflow'
    const difficulty = searchParams.get('difficulty') || 'intermediate'
    const time = searchParams.get('time') || ''

    // Using system fonts instead of custom fonts

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

    const imageResponse = new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#1a1a1a',
            backgroundImage: 'linear-gradient(to bottom right, #1a1a1a, #2d2d2d)',
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
              background: 'linear-gradient(to right, #ff6b35, #ffa500)',  // Orange gradient to match retro logo
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
                fontFamily: 'system-ui, -apple-system, sans-serif',
                fontWeight: 700,
                color: '#ffffff',
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
                    backgroundColor: '#ff6b35',
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
                      color: '#a0a0a0',
                    }}
                  >
                    by
                  </div>
                  <div
                    style={{
                      fontSize: '28px',
                      color: '#ffffff',
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
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  gap: '0',
                }}
              >
                <div
                  style={{
                    fontSize: '40px',
                    fontWeight: 900,
                    color: '#ffffff',
                    letterSpacing: '-2px',
                    lineHeight: '0.9',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <span>hypeflows</span>
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '-8px',
                      left: '0',
                      right: '0',
                      height: '3px',
                      background: '#22c55e',
                      display: 'flex',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '-12px',
                      left: '0',
                      right: '0',
                      height: '3px',
                      background: '#ff6b35',
                      display: 'flex',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '-16px',
                      left: '0',
                      right: '0',
                      height: '3px',
                      background: '#ffa500',
                      display: 'flex',
                    }}
                  />
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    color: '#ffa500',
                    letterSpacing: '2px',
                    marginTop: '20px',
                    textTransform: 'uppercase',
                    fontWeight: 700,
                  }}
                >
                  AI AND LLM WORKFLOWS
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )

    // Set proper headers for social media crawlers
    imageResponse.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
    imageResponse.headers.set('Content-Type', 'image/png')
    
    return imageResponse
  } catch (e) {
    console.log(`${e instanceof Error ? e.message : 'Unknown error'}`)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}