// ============================================
// বিজনেস উপদেষ্টা — শোরিফ AI (পাসওয়ার্ড প্রটেক্টেড)
// ============================================

document.addEventListener('DOMContentLoaded', function() {

    // ============================================
    // ১. পাসওয়ার্ড সিস্টেম
    // ============================================
    var CORRECT_PASSWORD = 'shorif123'; // ← তোমার পাসওয়ার্ড সেট করো
    var MAX_ATTEMPTS = 5;
    var attempts = 0;

    var lockScreen = document.getElementById('lockScreen');
    var mainContent = document.getElementById('mainContent');
    var passwordInput = document.getElementById('passwordInput');
    var unlockBtn = document.getElementById('unlockBtn');
    var lockError = document.getElementById('lockError');

    function unlockApp() {
        lockScreen.style.display = 'none';
        mainContent.style.display = 'block';
        // ক্লিয়ার করা
        passwordInput.value = '';
        lockError.innerHTML = '';
        attempts = 0;
    }

    function showError(msg) {
        lockError.innerHTML = msg;
        passwordInput.value = '';
        passwordInput.focus();
    }

    unlockBtn.addEventListener('click', function() {
        var entered = passwordInput.value.trim();

        if (entered === '') {
            showError('⚠️ দয়া করে কোড দিন।');
            return;
        }

        if (entered === CORRECT_PASSWORD) {
            unlockApp();
        } else {
            attempts++;
            var remaining = MAX_ATTEMPTS - attempts;
            if (remaining > 0) {
                showError('❌ ভুল কোড! ' + remaining + ' বার চেষ্টা বাকি।');
            } else {
                showError('🔒 অনেকবার ভুল কোড দেওয়ায় লক হয়ে গেছে। পেজ রিফ্রেশ করুন।');
                passwordInput.disabled = true;
                unlockBtn.disabled = true;
            }
        }
    });

    // এন্টার প্রেস
    passwordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') unlockBtn.click();
    });

    // পেজ রিফ্রেশে রিসেট
    window.addEventListener('load', function() {
        lockScreen.style.display = 'flex';
        mainContent.style.display = 'none';
        passwordInput.disabled = false;
        unlockBtn.disabled = false;
        attempts = 0;
        lockError.innerHTML = '';
    });

    // ============================================
    // ২. চ্যাট ফাংশন (আগের মতো)
    // ============================================
    var chatBox = document.getElementById('chatBox');
    var userInput = document.getElementById('userInput');
    var sendBtn = document.getElementById('sendBtn');
    var actionBtns = document.querySelectorAll('.action');
    var chips = document.querySelectorAll('.chip');

    function getAdvisorReply(question) {
        var q = question.toLowerCase().trim();

        if (q.includes('আইডিয়া') || q.includes('ব্যবসা') || q.includes('কী ব্যবসা')) {
            var ideas = [
                "স্যার, আপনি অনলাইন গ্রোসারি ডেলিভারি শুরু করতে পারেন — বর্তমানে খুব চাহিদা।",
                "স্যার, ইকো-ফ্রেন্ডলি পণ্য (বাঁশ/জুটের তৈরি) এখন ট্রেন্ডিং।",
                "স্যার, হোমমেড টিফিন সার্ভিস অফিস/কলেজ এলাকায় খুব চলছে।",
                "স্যার, মোবাইল রিপেয়ার ও এক্সেসরিজ শপ — কম খরচে ভালো লাভ।",
                "স্যার, অনলাইন টিউটোরিয়াল (স্কুল/কলেজ বিষয়) এখন ডিজিটাল যুগে দারুণ চলছে।"
            ];
            return "💡 " + ideas[Math.floor(Math.random() * ideas.length)];
        }

        if (q.includes('লাভ') || q.includes('বাড়াতে') || q.includes('মুনাফা')) {
            return "📈 স্যার, লাভ বাড়ানোর জন্য:\n✅ খরচ কমানো (সাপ্লায়ার পরিবর্তন)\n✅ নতুন পণ্য যোগ করা\n✅ অনলাইন মার্কেটিং বাড়ানো\n✅ গ্রাহকদের ফিডব্যাক নেওয়া";
        }

        if (q.includes('কম বাজেট') || q.includes('ছোট ব্যবসা') || q.includes('টাকা কম')) {
            return "💰 স্যার, কম বাজেটে (৫-২০ হাজার টাকা) ভালো ব্যবসা:\n✅ ফ্রিল্যান্সিং (কন্টেন্ট রাইটিং/ডিজাইন)\n✅ হোমমেড খাবার/টিফিন\n✅ মোবাইল রিপেয়ার\n✅ সোশ্যাল মিডিয়া ম্যানেজমেন্ট";
        }

        if (q.includes('মার্কেটিং') || q.includes('বিপণন') || q.includes('প্রচার')) {
            return "📣 স্যার, মার্কেটিং টিপস:\n✅ ফেসবুক/ইনস্টাগ্রামে টার্গেটেড বিজ্ঞাপন\n✅ গ্রাহক রেফারেল প্রোগ্রাম\n✅ লোকাল ইভেন্টে স্পনসর\n✅ ইউটিউব রিভিউ ভিডিও তৈরি";
        }

        if (q.includes('বিনিয়োগ') || q.includes('ইনভেস্ট') || q.includes('টাকা বিনিয়োগ')) {
            return "🏦 স্যার, বিনিয়োগের আগে:\n✅ মার্কেট রিসার্চ করুন\n✅ ছোট স্কেলে টেস্ট করুন\n✅ ৬ মাসের ক্যাশ ফ্লো প্ল্যান করুন\n✅ ঝুঁকি বিশ্লেষণ করুন";
        }

        if (q.includes('ডকুমেন্ট') || q.includes('চিঠি') || q.includes('প্রস্তাব')) {
            return "📄 স্যার, ব্যবসায়িক চিঠির জন্য আমি সাহায্য করতে পারি। নিচের 'ডকুমেন্ট প্রস্তাব' বাটনে ক্লিক করুন অথবা ক্লায়েন্টের নাম ও পণ্যের নাম লিখুন।";
        }

        if (q.includes('আসসালামু') || q.includes('সালাম') || q.includes('হ্যালো') || q.includes('হাই')) {
            return "ওয়ালাইকুম আসসালাম, স্যার! আমি আপনার সেবায় আছি। কীভাবে সাহায্য করতে পারি?";
        }

        return "স্যার, আমি আপনার প্রশ্ন বুঝতে পারিনি। দয়া করে নিচের অপশন থেকে বেছে নিন অথবা সহজভাবে প্রশ্নটি লিখুন।";
    }

    function addMessage(sender, text) {
        var msgDiv = document.createElement('div');
        msgDiv.className = sender === 'advisor' ? 'advisor-msg' : 'user-msg';
        msgDiv.innerHTML = text.replace(/\n/g, '<br>');
        chatBox.appendChild(msgDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    sendBtn.addEventListener('click', function() {
        var msg = userInput.value.trim();
        if (msg === '') return;
        addMessage('user', msg);
        addMessage('advisor', getAdvisorReply(msg));
        userInput.value = '';
    });

    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') sendBtn.click();
    });

    actionBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            var action = this.dataset.action;
            var question = '';
            if (action === 'idea') question = 'আমার ব্যবসার জন্য কোন আইডিয়া ভালো?';
            else if (action === 'profit') question = 'আমি কীভাবে লাভ বাড়াতে পারি?';
            else if (action === 'market') question = 'মার্কেটিং কীভাবে করব?';
            else if (action === 'invest') question = 'বিনিয়োগ সম্পর্কে পরামর্শ দিন।';
            else if (action === 'document') question = 'ডকুমেন্ট প্রস্তাব তৈরি করুন।';
            addMessage('user', question);
            addMessage('advisor', getAdvisorReply(question));
        });
    });

    chips.forEach(function(chip) {
        chip.addEventListener('click', function() {
            userInput.value = this.dataset.question;
            sendBtn.click();
        });
    });

});