import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getClimateDataFromZip, getStateElectricityRate } from '@/utils/calculations/climateData';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const zipCode = searchParams.get('zip');

    if (!zipCode) {
      return NextResponse.json(
        { error: 'ZIP code is required' },
        { status: 400 },
      );
    }

    // Get climate data
    const climateData = await getClimateDataFromZip(zipCode);

    // Add default electricity rate for the state
    const defaultRate = getStateElectricityRate(climateData.state);

    return NextResponse.json({
      ...climateData,
      defaultElectricityRate: defaultRate,
    });
  } catch (error) {
    console.error('Climate API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch climate data' },
      { status: 500 },
    );
  }
}
