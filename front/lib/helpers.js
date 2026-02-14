// Shared helper functions

export function timeAgo(ts) {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return mins + ' min ago';
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return hrs + 'h ago';
    const days = Math.floor(hrs / 24);
    if (days < 7) return days + 'd ago';
    return new Date(ts).toLocaleDateString();
}

export function esc(str) {
    if (typeof document === 'undefined') return str;
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

export const EMERGENCY_RE = /\b(chest\s*pain|heart\s*attack|stroke|seizure|difficulty\s*breathing|can'?t\s*breathe|shortness\s*of\s*breath|severe\s*bleeding|unconscious|anaphylaxis|overdose|suicid)\b/i;

export const CATEGORY_MAP = [
    { re: /\b(heart|chest|cardio|blood\s*pressure|palpitation|arrhythmia)\b/i, label: 'Cardiology', cat: 'cardiology' },
    { re: /\b(migraine|headache|seizure|neural|brain|neuro|dizziness)\b/i, label: 'Neurology', cat: 'neurology' },
    { re: /\b(skin|rash|mole|acne|eczema|dermat|itch)\b/i, label: 'Dermatology', cat: 'dermatology' },
    { re: /\b(bone|fracture|joint|knee|orthop|spine|back\s*pain)\b/i, label: 'Orthopedics', cat: 'orthopedics' },
    { re: /\b(stomach|digest|nausea|vomit|gastro|bowel|abdomen)\b/i, label: 'Gastroenterology', cat: 'gastro' },
    { re: /\b(eye|vision|optic|blind|cataract)\b/i, label: 'Ophthalmology', cat: 'ophthalmology' },
    { re: /\b(child|pediatr|infant|baby|toddler)\b/i, label: 'Pediatrics', cat: 'pediatrics' },
    { re: /\b(anxiety|depress|mental|therapy|psych|panic)\b/i, label: 'Psychiatry', cat: 'psychiatry' },
];
