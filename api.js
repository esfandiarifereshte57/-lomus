export async function GET() {
  return Response.json({
    posts: [
      { id: 1, user: 'سیستم', content: 'خوش آمدید به Lomus!' },
      { id: 2, user: 'سیستم', content: 'اولین شبکه اجتماعی شما' }
    ]
  })
}

export async function POST(request) {
  const body = await request.json()
  return Response.json({
    success: true,
    message: 'توییت شما ارسال شد',
    data: body
  })
}