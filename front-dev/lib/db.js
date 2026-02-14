/* ══════════════════════════════════════════════════════
   MedAware — Database Layer (Next.js)
   localStorage-backed store with CRUD helpers & mock seed
   ══════════════════════════════════════════════════════ */

const STORAGE_KEY = 'medaware_db';

// ── Internal helpers ──────────────────────────────
function _load() {
    if (typeof window === 'undefined') return null;
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch { return null; }
}

function _save(data) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function _db() {
    if (typeof window === 'undefined') {
        return { users: {}, posts: [], comments: [], currentUserId: 'user_current' };
    }
    let data = _load();
    if (!data) { data = _seed(); _save(data); }
    return data;
}

function _uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// ── Mock Data Seed ────────────────────────────────
function _seed() {
    const now = Date.now();
    const h = 3600000;
    const d = 86400000;

    const users = {
        'user_current': {
            id: 'user_current', name: 'Alex Thompson', username: 'alex_t', initials: 'AT',
            avatar_bg: 'linear-gradient(135deg, #0077B6, #00B4D8)',
            bio: 'Health enthusiast & patient advocate. Interested in cardiology and preventive medicine.',
            specialization: null, verified: false, joined: '2025-06-15',
            location: 'Paris, France', email: 'alex.t@email.com',
        },
        'user_dr_santos': {
            id: 'user_dr_santos', name: 'Dr. Maria Santos', username: 'dr_santos', initials: 'DM',
            avatar_bg: 'linear-gradient(135deg, #023E8A, #0096C7)',
            bio: 'Board-certified cardiologist with 15 years of experience.',
            specialization: 'Cardiologist', verified: true, joined: '2024-01-10',
            location: 'Lisbon, Portugal', email: 'maria.santos@hospital.pt',
        },
        'user_nurse_w': {
            id: 'user_nurse_w', name: 'Emily Williams, RN', username: 'nurse_williams', initials: 'NW',
            avatar_bg: 'linear-gradient(135deg, #90E0EF, #48CAE4)',
            bio: 'Registered Nurse specializing in emergency care.',
            specialization: 'Emergency Nurse', verified: true, joined: '2024-03-22',
            location: 'London, UK', email: 'emily.w@nhs.uk',
        },
        'user_james': {
            id: 'user_james', name: 'James Rodriguez', username: 'jamesR_health', initials: 'JR',
            avatar_bg: 'linear-gradient(135deg, #0077B6, #00B4D8)',
            bio: 'Fitness enthusiast navigating health concerns.',
            specialization: null, verified: false, joined: '2025-02-01',
            location: 'Madrid, Spain', email: 'james.r@email.com',
        },
        'user_sarah': {
            id: 'user_sarah', name: 'Sarah Lin', username: 'sarah_lin', initials: 'SL',
            avatar_bg: 'linear-gradient(135deg, #48CAE4, #90E0EF)',
            bio: 'Curious mind debunking health myths one post at a time.',
            specialization: null, verified: false, joined: '2025-04-12',
            location: 'Montréal, Canada', email: 'sarah.l@email.com',
        },
        'user_mike': {
            id: 'user_mike', name: 'Mike Kovac', username: 'mikeK_2024', initials: 'MK',
            avatar_bg: 'linear-gradient(135deg, #023E8A, #0077B6)',
            bio: 'Dealing with chronic migraines. Sharing my journey.',
            specialization: null, verified: false, joined: '2025-01-20',
            location: 'Prague, Czechia', email: 'mike.k@email.com',
        },
        'user_dr_patel': {
            id: 'user_dr_patel', name: 'Dr. Raj Patel, MD', username: 'dr_patel_eye', initials: 'RP',
            avatar_bg: 'linear-gradient(135deg, #7C3AED, #A78BFA)',
            bio: 'Ophthalmologist with 12 years of clinical experience.',
            specialization: 'Ophthalmologist', verified: true, joined: '2024-05-18',
            location: 'Mumbai, India', email: 'raj.patel@hospital.in',
        },
        'user_anna': {
            id: 'user_anna', name: 'Anna Kowalski', username: 'anna_wellness', initials: 'AK',
            avatar_bg: 'linear-gradient(135deg, #EC4899, #F472B6)',
            bio: 'Wellness blogger and new mom.',
            specialization: null, verified: false, joined: '2025-07-03',
            location: 'Warsaw, Poland', email: 'anna.k@email.com',
        },
    };

    const posts = [
        {
            id: 'post_1', userId: 'user_james',
            title: 'Persistent chest tightness after exercise — should I be worried?',
            body: "I've been experiencing a tight feeling in my chest after jogging for about 15 minutes. It usually goes away after resting, but I'm concerned. I'm a 34-year-old male, no prior heart conditions. My father had a minor heart attack at age 55. I don't smoke but I drink socially on weekends. Any advice would be greatly appreciated.",
            tags: [{ label: 'Specialty: Cardiology', type: 'specialty' }, { label: 'Urgent', type: 'urgent' }],
            category: 'cardiology', upvotes: 47, downvotes: 2, createdAt: now - 2 * h, verifiedResponses: 3,
            mythShield: {
                text: 'Exercise-induced chest tightness can have multiple causes, ranging from benign (e.g., exercise-induced asthma) to serious (e.g., angina). Family history of heart disease is a relevant risk factor. <strong>This is not a substitute for professional diagnosis.</strong>',
                sources: [
                    { label: 'WHO — Cardiovascular Diseases', url: 'https://www.who.int/health-topics/cardiovascular-diseases' },
                    { label: 'CDC — Heart Disease', url: 'https://www.cdc.gov/heartdisease/' },
                ]
            }
        },
        {
            id: 'post_2', userId: 'user_sarah',
            title: 'Is it true that cracking your knuckles causes arthritis?',
            body: "My grandmother always told me cracking knuckles leads to arthritis later in life. I've been doing it for years and now I'm worried. Is there any scientific evidence for this?",
            tags: [{ label: 'General', type: 'general' }],
            category: 'general', upvotes: 92, downvotes: 3, createdAt: now - 5 * h, verifiedResponses: 1,
            mythShield: {
                text: 'Multiple studies, including a notable self-experiment by Dr. Donald Unger over 60 years, found <strong>no link between knuckle cracking and arthritis</strong>. The sound comes from gas bubbles collapsing in synovial fluid.',
                sources: [{ label: 'Harvard Health — Knuckle Cracking', url: 'https://www.health.harvard.edu/pain/does-knuckle-cracking-cause-arthritis' }]
            }
        },
        {
            id: 'post_3', userId: 'user_mike',
            title: 'Recurring migraines with visual aura — when to see a specialist?',
            body: "For the past 3 months I've been getting migraines 2-3 times a week with zigzag lines in my vision beforehand. OTC painkillers aren't helping anymore. At what point should I see a neurologist?",
            tags: [{ label: 'Specialty: Neurology', type: 'specialty' }],
            category: 'neurology', upvotes: 128, downvotes: 1, createdAt: now - 8 * h, verifiedResponses: 5,
            mythShield: null,
        },
        {
            id: 'post_4', userId: 'user_sarah',
            title: 'New mole appeared on my arm — photo attached. Normal or concerning?',
            body: "I noticed a new dark mole on my upper left arm about 3 weeks ago. It's roughly 5mm, asymmetric, and has slightly uneven coloring. Should I get a dermatologist to check it, or am I overreacting?",
            tags: [{ label: 'Specialty: Dermatology', type: 'specialty' }, { label: 'General', type: 'general' }],
            category: 'dermatology', upvotes: 63, downvotes: 0, createdAt: now - 12 * h, verifiedResponses: 2,
            mythShield: null,
        },
        {
            id: 'post_5', userId: 'user_current',
            title: 'Managing anxiety without medication — what worked for you?',
            body: "I've been dealing with general anxiety for about a year now. I'm hesitant to start medication and would love to hear what non-pharmaceutical approaches have worked for people here. Therapy, exercise, meditation, supplements — anything you've tried.",
            tags: [{ label: 'Specialty: Psychiatry', type: 'specialty' }, { label: 'General', type: 'general' }],
            category: 'psychiatry', upvotes: 215, downvotes: 4, createdAt: now - d, verifiedResponses: 4,
            mythShield: null,
        },
        {
            id: 'post_6', userId: 'user_nurse_w',
            title: 'Common first-aid myths that could actually harm you',
            body: "As an ER nurse, I see patients come in all the time after following bad first-aid advice. Putting butter on burns, tilting your head back for nosebleeds, sucking venom from a snake bite — all of these are myths that can make things worse. Let me share what you should actually do.",
            tags: [{ label: 'General', type: 'general' }],
            category: 'general', upvotes: 342, downvotes: 5, createdAt: now - 2 * d, verifiedResponses: 3,
            mythShield: {
                text: 'Many widely believed first-aid practices have been debunked by medical research. Always follow guidelines from certified organizations like the Red Cross.',
                sources: [
                    { label: 'Red Cross — First Aid', url: 'https://www.redcross.org/take-a-class/first-aid' },
                    { label: 'WHO — Emergency Care', url: 'https://www.who.int/health-topics/emergency-care' },
                ]
            }
        },
        {
            id: 'post_7', userId: 'user_anna',
            title: 'Baby refusing solid foods at 9 months — is this normal?',
            body: "My 9-month-old daughter turns away from every solid food I try. She was exclusively breastfed and now gags on purees and finger foods. Our pediatrician said to keep trying, but it's been 3 weeks with no progress. Any parents gone through this?",
            tags: [{ label: 'Specialty: Pediatrics', type: 'specialty' }],
            category: 'pediatrics', upvotes: 18, downvotes: 0, createdAt: now - 3 * h, verifiedResponses: 0,
            mythShield: null,
        },
        {
            id: 'post_8', userId: 'user_mike',
            title: 'Constant ringing in left ear after concert — tinnitus?',
            body: "Went to a loud concert 4 days ago and my left ear has had a constant high-pitched ringing since. It's making it hard to sleep. Is this likely tinnitus? Will it go away on its own or do I need to see an ENT?",
            tags: [{ label: 'General', type: 'general' }],
            category: 'general', upvotes: 7, downvotes: 0, createdAt: now - 45 * 60000, verifiedResponses: 0,
            mythShield: null,
        },
        {
            id: 'post_9', userId: 'user_current',
            title: 'Sharp lower back pain when sitting for long periods — ergonomics issue?',
            body: "I've been working from home for 2 years and recently developed a sharp pain in my lower back, specifically on the right side, when I sit for more than 30 minutes. Standing relieves it. Could this be a disc issue or just poor posture? I'm 28.",
            tags: [{ label: 'Specialty: Orthopedics', type: 'specialty' }],
            category: 'orthopedics', upvotes: 3, downvotes: 0, createdAt: now - 5 * 60000, verifiedResponses: 0,
            mythShield: null,
        },
        {
            id: 'post_10', userId: 'user_dr_patel',
            title: "PSA: Blue-light glasses are mostly marketing — here's what actually helps eye strain",
            body: "As an ophthalmologist, I constantly get asked about blue-light-blocking glasses. The evidence is clear: they do very little for digital eye strain. What actually works is the 20-20-20 rule (every 20 minutes, look at something 20 feet away for 20 seconds), proper screen brightness, and artificial tears for dryness. Save your money.",
            tags: [{ label: 'Specialty: Ophthalmology', type: 'specialty' }, { label: 'General', type: 'general' }],
            category: 'ophthalmology', upvotes: 510, downvotes: 12, createdAt: now - 3 * d, verifiedResponses: 2,
            mythShield: {
                text: 'A 2021 Cochrane review found <strong>insufficient evidence</strong> that blue-light-filtering lenses reduce eye strain or improve sleep quality compared to non-filtering lenses. The 20-20-20 rule is widely recommended by the American Academy of Ophthalmology.',
                sources: [
                    { label: 'AAO — Blue Light and Digital Eye Strain', url: 'https://www.aao.org/eye-health/tips-prevention/are-computer-glasses-worth-it' },
                    { label: 'Cochrane Review', url: 'https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD013244.pub2/full' },
                ]
            }
        },
        {
            id: 'post_11', userId: 'user_james',
            title: 'Intermittent fasting — safe long-term or just a fad?',
            body: "I've been doing 16:8 intermittent fasting for 6 months and feel great. Lost 10kg and my blood work improved. But my doctor seemed concerned about long-term effects. Is there any evidence that IF is harmful over years?",
            tags: [{ label: 'General', type: 'general' }],
            category: 'general', upvotes: 287, downvotes: 8, createdAt: now - 4 * d, verifiedResponses: 0,
            mythShield: null,
        },
        {
            id: 'post_12', userId: 'user_anna',
            title: 'Bloating and stomach cramps every time I eat dairy — lactose intolerance developing in adulthood?',
            body: "I'm 31 and never had issues with dairy before, but for the past 2 months I get severe bloating, cramps, and gas within 30 minutes of consuming milk, cheese, or yogurt. Can you suddenly become lactose intolerant as an adult? Should I get tested or just eliminate dairy?",
            tags: [{ label: 'Specialty: Gastroenterology', type: 'specialty' }],
            category: 'gastro', upvotes: 41, downvotes: 1, createdAt: now - 6 * h, verifiedResponses: 0,
            mythShield: null,
        },
    ];

    const comments = [
        { id: 'cmt_1', postId: 'post_1', userId: 'user_dr_santos', body: "Given your age, family history, and the pattern you describe (exertional chest tightness that resolves with rest), I would recommend scheduling a <strong>stress test (exercise ECG)</strong> with your primary care physician as a first step. While this could be related to several benign conditions, the family history of cardiac events warrants investigation. In the meantime, avoid high-intensity exercise until you've been evaluated.", createdAt: now - 1 * h, reactions: { thanked: 23, informative: 15 }, isExpert: true },
        { id: 'cmt_2', postId: 'post_1', userId: 'user_current', body: "I had similar symptoms last year and it turned out to be exercise-induced asthma. Definitely worth getting checked by your doctor though — better safe than sorry!", createdAt: now - 1 * h, reactions: { informative: 8 }, isExpert: false },
        { id: 'cmt_3', postId: 'post_1', userId: 'user_james', body: "Thanks for sharing your experience! I hadn't considered asthma. I'll mention it to my doctor when I book the appointment.", createdAt: now - 45 * 60000, reactions: {}, isExpert: false, parentId: 'cmt_2' },
        { id: 'cmt_4', postId: 'post_1', userId: 'user_nurse_w', body: "Agree with Dr. Santos. I'd also suggest keeping a symptom diary — note the time, duration, intensity, what you ate/drank before exercise, and how long it takes to resolve.", createdAt: now - 30 * 60000, reactions: { thanked: 5, informative: 11 }, isExpert: true },
        { id: 'cmt_5', postId: 'post_2', userId: 'user_dr_santos', body: "Great question! The short answer is <strong>no</strong> — there is no scientific evidence linking knuckle cracking to arthritis. A researcher named Dr. Donald Unger cracked knuckles on one hand for over 60 years and found no difference.", createdAt: now - 4 * h, reactions: { thanked: 31, informative: 45 }, isExpert: true },
        { id: 'cmt_6', postId: 'post_2', userId: 'user_mike', body: "This is so reassuring! I've been cracking my knuckles since I was a teenager and was always worried about it.", createdAt: now - 3 * h, reactions: { thanked: 2 }, isExpert: false },
        { id: 'cmt_7', postId: 'post_5', userId: 'user_nurse_w', body: "Regular exercise has been shown to be as effective as medication for mild-to-moderate anxiety. Even a 20-minute walk can make a noticeable difference. Combine it with deep breathing or progressive muscle relaxation.", createdAt: now - 20 * h, reactions: { thanked: 18, informative: 22 }, isExpert: true },
        { id: 'cmt_8', postId: 'post_5', userId: 'user_sarah', body: "Cognitive Behavioral Therapy (CBT) was a game-changer for me. I also started journaling daily and it really helps with processing anxious thoughts. Headspace app is great for guided meditation too!", createdAt: now - 18 * h, reactions: { thanked: 12, informative: 9 }, isExpert: false },
        { id: 'cmt_9', postId: 'post_6', userId: 'user_james', body: "Wait, you're NOT supposed to tilt your head back for nosebleeds?! I've been doing that my whole life. What should you do instead?", createdAt: now - d - 2 * h, reactions: { informative: 3 }, isExpert: false },
        { id: 'cmt_10', postId: 'post_6', userId: 'user_nurse_w', body: "Lean slightly forward and pinch the soft part of your nose for 10-15 minutes. Tilting back can cause blood to flow down your throat, which can cause nausea or even aspiration.", createdAt: now - d - 1 * h, reactions: { thanked: 28, informative: 35 }, isExpert: true, parentId: 'cmt_9' },
    ];

    return { users, posts, comments, currentUserId: 'user_current' };
}

// ── Public API ────────────────────────────────────

export function getCurrentUser() {
    const data = _db();
    return data.users[data.currentUserId];
}

export function getUser(id) {
    return _db().users[id] || null;
}

export function updateUser(fields) {
    const data = _db();
    Object.assign(data.users[data.currentUserId], fields);
    _save(data);
    return data.users[data.currentUserId];
}

export function getPosts() {
    const data = _db();
    return data.posts
        .map(p => ({ ...p, user: data.users[p.userId] }))
        .sort((a, b) => b.createdAt - a.createdAt);
}

export function getPost(id) {
    const data = _db();
    const p = data.posts.find(x => x.id === id);
    if (!p) return null;
    return { ...p, user: data.users[p.userId] };
}

export function addPost({ title, body, tags, category }) {
    const data = _db();
    const post = {
        id: 'post_' + _uid(),
        userId: data.currentUserId,
        title, body, tags: tags || [],
        category: category || 'general',
        upvotes: 0, downvotes: 0,
        createdAt: Date.now(),
        verifiedResponses: 0,
        mythShield: null,
    };
    data.posts.push(post);
    _save(data);
    return post;
}

export function votePost(postId, dir) {
    const data = _db();
    const p = data.posts.find(x => x.id === postId);
    if (!p) return;
    if (dir === 'up') p.upvotes++;
    else if (dir === 'down') p.downvotes++;
    _save(data);
    return p;
}

export function getComments(postId) {
    const data = _db();
    return data.comments
        .filter(c => c.postId === postId)
        .map(c => ({ ...c, user: data.users[c.userId] }))
        .sort((a, b) => a.createdAt - b.createdAt);
}

export function addComment(postId, body) {
    const data = _db();
    const comment = {
        id: 'cmt_' + _uid(),
        postId,
        userId: data.currentUserId,
        body,
        createdAt: Date.now(),
        reactions: {},
        isExpert: data.users[data.currentUserId].verified,
    };
    data.comments.push(comment);
    if (comment.isExpert) {
        const post = data.posts.find(p => p.id === postId);
        if (post) post.verifiedResponses++;
    }
    _save(data);
    return { ...comment, user: data.users[data.currentUserId] };
}

export function reactToComment(commentId, reactionType) {
    const data = _db();
    const c = data.comments.find(x => x.id === commentId);
    if (!c) return;
    if (!c.reactions[reactionType]) c.reactions[reactionType] = 0;
    c.reactions[reactionType]++;
    _save(data);
    return c;
}

export function getUserStats(userId) {
    const data = _db();
    const uid = userId || data.currentUserId;
    const posts = data.posts.filter(p => p.userId === uid);
    const comments = data.comments.filter(c => c.userId === uid);
    const totalUpvotes = posts.reduce((s, p) => s + p.upvotes, 0);
    return { postsCount: posts.length, commentsCount: comments.length, helpfulVotes: totalUpvotes };
}

export function resetDB() {
    if (typeof window !== 'undefined') localStorage.removeItem(STORAGE_KEY);
}
