import { ProblemCategory } from '../types';

export interface CampusExample {
  title: string;
  category: ProblemCategory;
  location: string;
  description: string;
  tag: string;
}

export const CAMPUS_EXAMPLES: CampusExample[] = [
  {
    title: 'Water Cooler Leaking and Flooding Hallway Floor',
    category: 'Water',
    location: 'Science Complex, Building B, 2nd Floor Corridor outside Chem Lab 204',
    description: 'The automated cold water dispenser has a cracked drain hose. Water has pooled across roughly 15 feet of the polished tile floor, creating a severe slipping hazard near the lab entrance where students carry glassware.',
    tag: 'Slip Hazard'
  },
  {
    title: 'Main Quad Elevator Stuck Between 3rd and 4th Floors',
    category: 'Infrastructure',
    location: 'Central Library, Main Tower West Elevator Bank',
    description: 'Elevator #2 shuddered and stopped between floors 3 and 4 with the door indicator blinking an error code. No students are currently trapped inside, but the call button is unresponsive and students with mobility aids cannot reach upper level stacks.',
    tag: 'Accessibility'
  },
  {
    title: 'Flickering Fluorescent Light and Exposed Switchboard',
    category: 'Electricity',
    location: 'North Residential Quad, Elm Hall, 3rd Floor Study Lounge',
    description: 'The overhead lighting ballast is buzzing loudly and strobing uncontrollably. Additionally, the plastic wall plate on the light switch is cracked off, leaving live wiring terminals partially accessible near the lounge door.',
    tag: 'Electrical Safety'
  },
  {
    title: 'Overflowing Trash Bins & Broken Bottles After Student Fair',
    category: 'Cleanliness',
    location: 'Student Union Plaza, Outdoor Amphitheater & Steps',
    description: 'Following yesterday\'s club recruitment fair, three large recycling and compost bins are overflowing. Cardboard containers, food waste, and several broken glass soda bottles are scattered across the amphitheater concrete stairs.',
    tag: 'Sanitation'
  },
  {
    title: 'Broken Central AC Making Seminar Hall Unbearably Hot',
    category: 'Other',
    location: 'Humanities Hall, Room 101 (200-person Auditorium)',
    description: 'The HVAC unit has completely shut down for the second consecutive day during midterm review week. The lecture room temperature is over 86°F (30°C) with no opening windows, making 90-minute lectures difficult for students.',
    tag: 'Classroom Climate'
  }
];
