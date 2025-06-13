import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { format, startOfYear, eachDayOfInterval, endOfYear } from 'date-fns';
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useHover,
  useDismiss,
  useRole,
  useInteractions,
  FloatingPortal,
  arrow
} from '@floating-ui/react';

const SUPABASE_URL = 'https://tlisradyhpaqlzxbblhm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsaXNyYWR5aHBhcWx6eGJibGhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3MDE1MTcsImV4cCI6MjA2NDI3NzUxN30._zKeuPATi2W-AlEpi8VP_1ExgeSf2YSDwa0bxje5yH4';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface Entry {
  created_at: string;
  mood_color: string;
  mood: string;
  content: string;
}

interface DayEntries {
  entries: Entry[];
  latestColor: string;
}

const EMPTY_COLOR = '#F0F0F0';
const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function DayTooltip({ entries, date }: { entries: Entry[], date: Date }) {
  const arrowRef = React.useRef(null);
  const [open, setOpen] = React.useState(false);

  const {
    x,
    y,
    strategy,
    context,
    refs,
    placement,
    middlewareData: { arrow: { x: arrowX, y: arrowY } = {} },
  } = useFloating({
    placement: "top",
    middleware: [
      offset(8),
      flip(),
      shift(),
      arrow({ element: arrowRef }),
    ],
    whileElementsMounted: autoUpdate,
    open,
    onOpenChange: setOpen,
  });

  const hover = useHover(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    dismiss,
    role,
  ]);

  return (
    <>
      <div
        ref={refs.setReference}
        className="w-3 h-3 m-[1px] rounded-sm transition-all duration-200 hover:scale-150"
        style={{ backgroundColor: entries[entries.length - 1].mood_color }}
        {...getReferenceProps()}
      />
      {open && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={{
              position: strategy,
              top: y ?? 0,
              left: x ?? 0,
              width: 'max-content',
              maxWidth: '300px',
            }}
            className="bg-white rounded-lg shadow-lg border border-gray-200 p-3 z-50"
            {...getFloatingProps()}
          >
            <div 
              ref={arrowRef}
              className="absolute bg-white w-2 h-2 rotate-45 border-gray-200"
              style={{
                left: arrowX != null ? `${arrowX}px` : '',
                top: placement === 'top' ? '100%' : '',
                bottom: placement === 'bottom' ? '100%' : '',
                borderStyle: 'solid',
                borderWidth: placement === 'top' ? '0 1px 1px 0' : '1px 0 0 1px',
                transform: 'translate(-50%, -50%) rotate(45deg)',
              }}
            />
            <div className="relative">
              <div className="text-sm font-medium text-gray-600 mb-2">
                {format(date, 'MMMM d, yyyy')}
              </div>
              <div className="space-y-3">
                {entries.map((entry, i) => (
                  <div key={i} className="text-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <div 
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: entry.mood_color }}
                      />
                      <span className="text-forest-600">{entry.mood}</span>
                      <span className="text-gray-400 text-xs">
                        {format(new Date(entry.created_at), 'h:mm a')}
                      </span>
                    </div>
                    <p className="text-gray-600 line-clamp-2">
                      {entry.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FloatingPortal>
      )}
    </>
  );
}

export default function MoodTracker() {
  const [moodData, setMoodData] = useState<{ [key: string]: DayEntries }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get all days of the current year
  const currentYear = new Date().getFullYear();
  const yearStart = startOfYear(new Date(currentYear, 0, 1));
  const yearEnd = endOfYear(yearStart);
  const allDays = eachDayOfInterval({ start: yearStart, end: yearEnd });

  // Fetch mood data from Supabase
  useEffect(() => {
    async function fetchMoodData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('No authenticated user');

        const { data, error } = await supabase
          .from('entries')
          .select('created_at, mood_color, mood, content')
          .eq('user_id', user.id)
          .gte('created_at', yearStart.toISOString())
          .lte('created_at', yearEnd.toISOString())
          .order('created_at', { ascending: true });

        if (error) throw error;

        // Group entries by date
        const entriesByDate = (data || []).reduce((acc: { [key: string]: DayEntries }, entry) => {
          const date = format(new Date(entry.created_at), 'yyyy-MM-dd');
          if (!acc[date]) {
            acc[date] = { entries: [], latestColor: entry.mood_color };
          }
          acc[date].entries.push(entry);
          acc[date].latestColor = entry.mood_color; // Latest color will be the last one
          return acc;
        }, {});

        setMoodData(entriesByDate);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch mood data');
      } finally {
        setLoading(false);
      }
    }

    fetchMoodData();
  }, []);

  // Group days by weeks for the grid
  const weeks = allDays.reduce((acc: Date[][], day: Date) => {
    const weekIndex = Math.floor(allDays.indexOf(day) / 7);
    if (!acc[weekIndex]) acc[weekIndex] = [];
    acc[weekIndex].push(day);
    return acc;
  }, []);

  if (loading) return <div>Loading mood tracker...</div>;
  if (error) return <div>Error: {error}</div>;

  // Get unique moods for legend
  const uniqueMoods = new Set<string>();
  const moodColors = new Map<string, string>();
  Object.values(moodData).forEach(({ entries }) => {
    const latestEntry = entries[entries.length - 1];
    if (latestEntry.mood && latestEntry.mood_color) {
      uniqueMoods.add(latestEntry.mood);
      moodColors.set(latestEntry.mood, latestEntry.mood_color);
    }
  });

  return (
    <div className="p-8">
      <h2 className="text-2xl font-['Playfair_Display'] text-forest-700 mb-6">Your Mood Journey</h2>
      
      <div className="flex">
        {/* Days of week labels */}
        <div className="flex flex-col mr-2 text-sm text-gray-500 pt-[2px]">
          {DAYS_OF_WEEK.map(day => (
            <div key={day} className="h-[14px] text-xs flex items-center">{day}</div>
          ))}
        </div>

        {/* Grid */}
        <div className="flex-1">
          <div className="flex flex-col">
            {/* Month labels */}
            <div className="flex text-xs text-gray-500 h-6 items-end pb-1">
              {Array.from(new Set(allDays.map((d: Date) => format(d, 'MMM')))).map((month: string) => (
                <div key={month} className="w-[56px]">{month}</div>
              ))}
            </div>
            
            {/* Grid rows */}
            <div className="flex">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col">
                  {DAYS_OF_WEEK.map((_, dayIndex) => {
                    const date = week[dayIndex];
                    if (!date) return <div key={dayIndex} className="w-3 h-3 m-[1px]" />;
                    
                    const dateKey = format(date, 'yyyy-MM-dd');
                    const dayData = moodData[dateKey];

                    if (!dayData) {
                      return (
                        <div
                          key={dateKey}
                          className="w-3 h-3 m-[1px] rounded-sm"
                          style={{ backgroundColor: EMPTY_COLOR }}
                        />
                      );
                    }

                    return (
                      <DayTooltip
                        key={dateKey}
                        entries={dayData.entries}
                        date={date}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legend - Only show if there are entries */}
      {uniqueMoods.size > 0 && (
        <div className="mt-6 flex flex-wrap gap-4 items-center text-sm text-gray-600">
          {Array.from(uniqueMoods).map(mood => (
            <div key={mood} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: moodColors.get(mood) }}
              />
              <span>{mood}</span>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: EMPTY_COLOR }}
            />
            <span>No entry</span>
          </div>
        </div>
      )}
    </div>
  );
} 