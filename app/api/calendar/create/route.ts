import { google } from "googleapis";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

type CreateCalendarEventBody = {
  summary?: string;
  description?: string;
  startDateTime?: string;
  endDateTime?: string;
};

type SessionWithAccessToken = {
  accessToken?: string;
};

export async function POST(request: Request) {
  const session = (await getServerSession(authOptions)) as SessionWithAccessToken | null;

  if (!session?.accessToken) {
    return NextResponse.json(
      { error: "Unauthorized: missing Google access token." },
      { status: 401 },
    );
  }

  try {
    const body = (await request.json()) as CreateCalendarEventBody;
    const { summary, description, startDateTime, endDateTime } = body;

    if (!summary || !startDateTime || !endDateTime) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: summary, startDateTime, and endDateTime are required.",
        },
        { status: 400 },
      );
    }

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: session.accessToken });

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    const response = await calendar.events.insert({
      calendarId: "primary",
      requestBody: {
        summary,
        description,
        start: {
          dateTime: startDateTime,
        },
        end: {
          dateTime: endDateTime,
        },
      },
    });

    return NextResponse.json(
      {
        message: "Event created successfully.",
        eventId: response.data.id,
        eventUrl: response.data.htmlLink,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Google Calendar event creation failed:", error);

    return NextResponse.json(
      { error: "Failed to create calendar event." },
      { status: 500 },
    );
  }
}
