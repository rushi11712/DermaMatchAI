let stepHistory = [1];
let userProfile = {};

const skinData = {
    1: {
        title: "What is your skin texture?",
        subtitle: "This helps us know the moisture content in your skin.",
        key: "texture",
        options: [
            { id: "oily", label: "Oily", img: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=150" },
            { id: "dry", label: "Dry", img: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=150" },
            { id: "combination", label: "Combination", img: "https://images.unsplash.com/photo-1552046122-03184de85e08?w=150" }
        ]
    },
    2: {
        title: "What is your skin type?",
        subtitle: "This helps us with the right ingredients for your skin.",
        key: "type",
        options: [
            { id: "normal", label: "Normal", img: "https://images.unsplash.com/photo-1512290923902-8a9f81dc206e?w=150" },
            { id: "sensitive", label: "Sensitive", img: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=150" }
        ]
    },
    3: {
        title: "Which of these describe your concern?",
        subtitle: "Select any one",
        key: "concern",
        options: [
            { id: "acne", label: "Acne", desc: "Clogged hair follicles.", img: "https://images.unsplash.com/photo-1600428839013-413f9f30e071?w=150" },
            { id: "pores", label: "Open Pores", desc: "Small bumps/bacteria accumulation.", img: "https://images.unsplash.com/photo-1552046122-03184de85e08?w=150" },
            { id: "pigmentation", label: "Pigmentation", desc: "Dark spots or patches.", img: "https://images.unsplash.com/photo-1590004953392-5aba2e785943?w=150" },
            { id: "dark_circles", label: "Dark Circles", desc: "Darkening beneath eyes.", img: "https://images.unsplash.com/photo-1544465544-1b71aee9dfa3?w=150" },
            { id: "scars", label: "Acne Marks & Scars", desc: "Result of inflamed blemishes.", img: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=150" },
            { id: "aging", label: "Aging", desc: "Loss of texture & elasticity.", img: "https://images.unsplash.com/photo-1512290923902-8a9f81dc206e?w=150" }
        ]
    },
    "sub_pigmentation": {
        title: "Which of these describe your sub-concern?",
        subtitle: "Selecting best treatment for pigmentation...",
        key: "subConcern",
        options: [
            { id: "melasma", label: "Melasma/Blemishes", desc: "Hormonal or sun damage patches." },
            { id: "dark_spots", label: "Dark Spots", desc: "Black spots on face or hands." },
            { id: "uneven", label: "Uneven skin tone", desc: "Darker parts (e.g. around mouth)." }
        ]
    },
    "sub_acne": {
        title: "Which of these describe your sub-concern?",
        subtitle: "Selecting best treatment for acne...",
        key: "subConcern",
        options: [
            { id: "papules", label: "Papules", desc: "Small red bumps." },
            { id: "pustules", label: "Pustules", desc: "White bumps containing pus." },
            { id: "whiteheads", label: "Whiteheads", desc: "Clogged pores." },
            { id: "blackheads", label: "Blackheads", desc: "Clogged pores exposed to air." }
        ]
    },
    "sub_scars": {
        title: "Which of these describe your sub-concern?",
        subtitle: "Selecting best treatment for scars...",
        key: "subConcern",
        options: [
            { id: "acne_scars", label: "Acne Scars", desc: "Permanent bumpy skin." },
            { id: "acne_marks", label: "Acne Marks", desc: "Temporary spots left after acne." }
        ]
    }
};

function startAssessment() {
    document.getElementById('landing-page').classList.add('hidden');
    document.getElementById('assessment-flow').classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Reset state
    stepHistory = [1];
    userProfile = {};
    renderView(1);
}

function exitAssessment() {
    document.getElementById('landing-page').classList.remove('hidden');
    document.getElementById('assessment-flow').classList.add('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderView(stepID) {
    const container = document.getElementById('app-container');
    const backBtn = document.getElementById('back-btn');
    
    backBtn.classList.toggle('hidden', stepID === 1 || stepID === "report");
    updateStepper(stepID);

    if (stepID === "report") {
        renderReport(container);
        return;
    }

    const data = skinData[stepID];
    container.innerHTML = `
        <div class="view-enter">
            <div class="text-center mb-10">
                <h2 class="text-2xl lg:text-3xl font-extrabold text-slate-900 mb-3">${data.title}</h2>
                <p class="text-slate-500 text-sm font-medium">${data.subtitle}</p>
            </div>
            <div class="space-y-4">
                ${data.options.map(opt => `
                    <div onclick="processSelection('${opt.id}')" class="option-card flex items-center p-4 rounded-3xl cursor-pointer">
                        ${opt.img ? `<div class="w-16 h-16 rounded-full overflow-hidden mr-5 border-4 border-slate-50 shadow-sm"><img src="${opt.img}" class="w-full h-full object-cover"></div>` : ''}
                        <div class="flex-1">
                            <div class="font-bold text-slate-800 text-lg mb-1">${opt.label}</div>
                            ${opt.desc ? `<div class="text-xs text-slate-500 leading-relaxed">${opt.desc}</div>` : ''}
                        </div>
                        <div class="custom-radio ml-4"></div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function processSelection(id) {
    const currentStep = stepHistory[stepHistory.length - 1];
    const data = skinData[currentStep];
    userProfile[data.key] = id;

    let nextStep;
    if (currentStep === 1) nextStep = 2;
    else if (currentStep === 2) nextStep = 3;
    else if (currentStep === 3) {
        if (id === "pigmentation") nextStep = "sub_pigmentation";
        else if (id === "acne") nextStep = "sub_acne";
        else if (id === "scars") nextStep = "sub_scars";
        else nextStep = "report";
    } else {
        nextStep = "report";
    }

    stepHistory.push(nextStep);
    renderView(nextStep);
}

function goBack() {
    if (stepHistory.length > 1) {
        stepHistory.pop();
        renderView(stepHistory[stepHistory.length - 1]);
    }
}

function updateStepper(stepID) {
    const line = document.getElementById('progress-bar-line');
    const dots = document.querySelectorAll('.step-indicator div');
    
    let percentage = 0;
    if (typeof stepID === 'number') percentage = ((stepID - 1) / 2) * 100;
    else percentage = 100;

    line.style.width = percentage + "%";
    dots.forEach((dot, i) => {
        const stepNum = i + 1;
        const isActive = (typeof stepID === 'number' && stepNum <= stepID) || stepID === "report" || typeof stepID === 'string';
        dot.className = isActive ? "w-3 h-3 rounded-full bg-teal-600 transition-colors shadow-sm shadow-teal-500/50" : "w-3 h-3 rounded-full bg-slate-200 transition-colors";
    });
}

function renderReport(container) {
    const score = 89; // Static score for demo purposes
    const concernLabel = userProfile.concern ? skinData[3].options.find(o => o.id === userProfile.concern).label : 'skin concerns';
    
    container.innerHTML = `
        <div class="text-center view-enter">
            <div class="relative w-48 h-48 mx-auto mb-10">
                <svg class="w-full h-full -rotate-90">
                    <circle cx="96" cy="96" r="75" stroke="#f1f5f9" stroke-width="12" fill="none" />
                    <circle id="scoreCircle" cx="96" cy="96" r="75" stroke="#0d9488" stroke-width="12" fill="none" stroke-linecap="round" />
                </svg>
                <div class="absolute inset-0 flex flex-col items-center justify-center">
                    <span id="scoreVal" class="text-5xl font-black text-slate-900">0%</span>
                    <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Skin Health</span>
                </div>
            </div>
            
            <h2 class="text-3xl font-black mb-4 text-slate-900">Your Custom Protocol</h2>
            
            <div class="p-8 bg-slate-50 border border-slate-100 rounded-[2rem] text-left mb-10 shadow-inner relative overflow-hidden">
                <div class="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-bl-full pointer-events-none"></div>
                
                <div class="flex items-center gap-2 mb-4">
                    <div class="w-6 h-6 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center text-xs"><i class="fas fa-sparkles"></i></div>
                    <span class="text-teal-700 font-bold uppercase text-[11px] tracking-wider">AI Analysis Complete</span>
                </div>
                
                <p class="text-slate-600 text-[15px] leading-relaxed relative z-10">
                    Based on our analysis, you have <strong class="text-slate-900 capitalize">${userProfile.texture || 'combination'}</strong>, <strong class="text-slate-900 capitalize">${userProfile.type || 'normal'}</strong> skin with active <strong class="text-teal-600">${concernLabel}</strong>. 
                </p>
                <p class="text-slate-600 text-[15px] leading-relaxed relative z-10 mt-3">
                    Your optimal routine should focus on localized treatments containing <strong>Niacinamide</strong> to regulate sebum, and <strong>Vitamin C</strong> to target pigmentation and boost collagen synthesis.
                </p>
            </div>
            
            <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button class="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-teal-600 text-white rounded-full font-bold shadow-lg transition-all hover:-translate-y-1">
                    Get Full Routine
                </button>
                <button onclick="startAssessment()" class="w-full sm:w-auto px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full font-bold transition-all">
                    Retake Assessment
                </button>
            </div>
        </div>
    `;

    setTimeout(() => {
        const circle = document.getElementById('scoreCircle');
        if (circle) {
            circle.style.strokeDashoffset = 471 - (471 * score / 100);
            let current = 0;
            const timer = setInterval(() => {
                if (current >= score) clearInterval(timer);
                const scoreEl = document.getElementById('scoreVal');
                if (scoreEl) scoreEl.innerText = current + "%";
                current++;
            }, 25);
        }
    }, 150);
}

// Ensure smooth scrolling for navbar links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});
