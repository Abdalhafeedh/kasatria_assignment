// Debug endpoint to check environment variables (safe version)

export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');

    const hasSheetId = !!process.env.GOOGLE_SHEET_ID;
    const hasRange = !!process.env.GOOGLE_SHEET_RANGE;
    const hasClientId = !!process.env.GOOGLE_CLIENT_ID;

    res.status(200).json({
        status: 'ok',
        environment: {
            GOOGLE_SHEET_ID: hasSheetId ? `${process.env.GOOGLE_SHEET_ID.substring(0, 10)}... (set)` : 'NOT SET',
            GOOGLE_SHEET_RANGE: hasRange ? process.env.GOOGLE_SHEET_RANGE : 'NOT SET (will use default A1:F201)',
            GOOGLE_CLIENT_ID: hasClientId ? '(set)' : 'NOT SET'
        },
        message: hasSheetId ? 'Environment variables are configured' : 'GOOGLE_SHEET_ID is missing!'
    });
}
