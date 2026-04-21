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
                <h2 class="text-2xl font-extrabold text-slate-900 mb-2">${data.title}</h2>
                <p class="text-slate-400 text-sm font-medium">${data.subtitle}</p>
            </div>
            <div class="space-y-4">
                ${data.options.map(opt => `
                    <div onclick="processSelection('${opt.id}')" class="option-card flex items-center p-4 rounded-3xl cursor-pointer">
                        ${opt.img ? `<div class="w-16 h-16 rounded-full overflow-hidden mr-4 border-2 border-slate-50"><img src="${opt.img}" class="w-full h-full object-cover"></div>` : ''}
                        <div class="flex-1">
                            <div class="font-bold text-slate-800">${opt.label}</div>
                            ${opt.desc ? `<div class="text-[11px] text-slate-400 leading-tight">${opt.desc}</div>` : ''}
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
    if (typeof stepID === 'number') percentage = (stepID - 1) * 50;
    else percentage = 100;

    line.style.width = percentage + "%";
    dots.forEach((dot, i) => {
        const stepNum = i + 1;
        const isActive = (typeof stepID === 'number' && stepNum <= stepID) || stepID === "report" || typeof stepID === 'string';
        dot.className = isActive ? "w-3 h-3 rounded-full bg-teal-600 transition-colors" : "w-3 h-3 rounded-full bg-slate-200 transition-colors";
    });
}

function renderReport(container) {
    const score = 89;
    container.innerHTML = `
        <div class="text-center view-enter">
            <div class="relative w-44 h-44 mx-auto mb-8">
                <svg class="w-full h-full -rotate-90">
                    <circle cx="88" cy="88" r="75" stroke="#f1f5f9" stroke-width="12" fill="none" />
                    <circle id="scoreCircle" cx="88" cy="88" r="75" stroke="#0d9488" stroke-width="12" fill="none" />
                </svg>
                <div class="absolute inset-0 flex flex-col items-center justify-center">
                    <span id="scoreVal" class="text-5xl font-black text-slate-900">0%</span>
                    <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Quality</span>
                </div>
            </div>
            <h2 class="text-2xl font-black mb-4">Assessment Complete</h2>
            <div class="p-6 bg-slate-50 border border-slate-100 rounded-[2rem] text-left mb-8 shadow-inner">
                <p class="text-slate-600 text-sm leading-relaxed">
                    <span class="text-teal-600 font-bold uppercase text-[10px] block mb-1">Gemini</span>
                    Analysis suggests high moisture retention but active ${userProfile.concern || 'skin concerns'}. 
                    Focus on localized treatments containing <strong>Niacinamide</strong> and <strong>Vitamin C</strong>.
                </p>
            </div>
            <button onclick="location.reload()" class="text-teal-600 font-bold underline underline-offset-8">Retake Assessment</button>
        </div>
    `;

    setTimeout(() => {
        document.getElementById('scoreCircle').style.strokeDashoffset = 471 - (471 * score / 100);
        let current = 0;
        const timer = setInterval(() => {
            if (current >= score) clearInterval(timer);
            document.getElementById('scoreVal').innerText = current + "%";
            current++;
        }, 25);
    }, 150);
}

document.addEventListener('DOMContentLoaded', () => renderView(1));