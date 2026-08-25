// ============================================
// ফ্রি নলেজ ইঞ্জিন — উইকিপিডিয়া + নিউজ + লোকাল
// ============================================

document.addEventListener('DOMContentLoaded', function() {

    // ============================================
    // ১. পাসওয়ার্ড সিস্টেম (আগের মতো)
    // ============================================
    var CORRECT_PASSWORD = 'shorif123';
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

    passwordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') unlockBtn.click();
    });

    window.addEventListener('load', function() {
        lockScreen.style.display = 'flex';
        mainContent.style.display = 'none';
        passwordInput.disabled = false;
        unlockBtn.disabled = false;
        attempts = 0;
        lockError.innerHTML = '';
    });

    // ============================================
    // ২. চ্যাট এলিমেন্ট সিলেক্ট
    // ============================================
    var chatBox = document.getElementById('chatBox');
    var userInput = document.getElementById('userInput');
    var sendBtn = document.getElementById('sendBtn');
    var actionBtns = document.querySelectorAll('.action');
    var chips = document.querySelectorAll('.chip');

    // ============================================
    // ৩. উইকিপিডিয়া থেকে তথ্য আনা (ফ্রি)
    // ============================================
    async function getWikipediaInfo(query) {
        try {
            // প্রথমে বাংলা উইকিপিডিয়া চেষ্টা
            var bnUrl = `https://bn.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;
            var response = await fetch(bnUrl);
            
            if (response.ok) {
                var data = await response.json();
                if (data.extract) {
                    return data.extract;
                }
            }

            // না পেলে ইংরেজি উইকিপিডিয়া
            var enUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;
            response = await fetch(enUrl);
            if (response.ok) {
                data = await response.json();
                if (data.extract) {
                    return data.extract;
                }
            }
            return null;
        } catch (error) {
            return null;
        }
    }

    // ============================================
    // ৪. গুগল নিউজ থেকে খবর আনা (ফ্রি RSS)
    // ============================================
    async function getNews(query) {
        try {
            var url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=bn&gl=BD&ceid=BD:bn`;
            var response = await fetch('https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(url));
            
            if (response.ok) {
                var data = await response.json();
                if (data.items && data.items.length > 0) {
                    var newsText = '📰 সর্বশেষ খবর:\n';
                    for (var i = 0; i < Math.min(3, data.items.length); i++) {
                        newsText += `✅ ${data.items[i].title}\n`;
                    }
                    return newsText;
                }
            }
            return null;
        } catch (error) {
            return null;
        }
    }

    // ============================================
    // ৫. লোকাল ডেটাবেস (দ্রুত উত্তরের জন্য)
    // ============================================
    function getLocalAnswer(q) {
        // ব্যবসা সম্পর্কিত
        if (q.includes('আইডিয়া') || q.includes('ব্যবসা') || q.includes('কী ব্যবসা')) {
            var ideas = [
                "🛒 অনলাইন গ্রোসারি ডেলিভারি (স্থানীয় সবজি-মাছ)",
                "👕 ইকো-ফ্রেন্ডলি ফ্যাশন ব্র্যান্ড (বাঁশ/জুটের তৈরি)",
                "🍱 টিফিন সার্ভিস (অফিস/কলেজের জন্য হোমমেড খাবার)",
                "📱 মোবাইল ফোন রিপেয়ার ও এক্সেসরিজ শপ",
                "🎓 অনলাইন টিউটোরিয়াল (স্কুল/কলেজ বিষয়)",
                "🧹 প্রফেশনাল হোম ক্লিনিং সার্ভিস"
            ];
            return "💡 " + ideas[Math.floor(Math.random() * ideas.length)];
        }

        // লাভ
        if (q.includes('লাভ') || q.includes('বাড়াতে') || q.includes('মুনাফা')) {
            return "📈 স্যার, লাভ বাড়ানোর জন্য:\n✅ খরচ কমানো (সাপ্লায়ার পরিবর্তন)\n✅ নতুন পণ্য যোগ করা\n✅ অনলাইন মার্কেটিং বাড়ানো\n✅ গ্রাহকদের ফিডব্যাক নেওয়া";
        }

        // বিনিয়োগ
        if (q.includes('বিনিয়োগ') || q.includes('ইনভেস্ট')) {
            return "🏦 স্যার, বিনিয়োগের আগে:\n✅ মার্কেট রিসার্চ করুন\n✅ ছোট স্কেলে টেস্ট করুন\n✅ ৬ মাসের ক্যাশ ফ্লো প্ল্যান করুন";
        }

        // মার্কেটিং
        if (q.includes('মার্কেটিং') || q.includes('বিপণন') || q.includes('প্রচার')) {
            return "📣 স্যার, মার্কেটিং টিপস:\n✅ ফেসবুক/ইনস্টাগ্রামে টার্গেটেড বিজ্ঞাপন\n✅ গ্রাহক রেফারেল প্রোগ্রাম\n✅ লোকাল ইভেন্টে স্পনসর";
        }

        // গ্রিটিং
        if (q.includes('আসসালামু') || q.includes('সালাম') || q.includes('হ্যালো') || q.includes('হাই')) {
            return "ওয়ালাইকুম আসসালাম, স্যার! আমি আপনার সেবায় আছি। কীভাবে সাহায্য করতে পারি?";
        }

        return null; // না পেলে null রিটার্ন
    }

    // ============================================
    // ৬. প্রধান উত্তর দান ফাংশন (হাইব্রিড)
    // ============================================
    async function getAdvisorReply(question) {
        var q = question.toLowerCase().trim();

        // ১. লোকাল ডেটাবেস চেক (দ্রুত)
        var localAnswer = getLocalAnswer(q);
        if (localAnswer) return localAnswer;

        // ২. উইকিপিডিয়া চেক
        var wikiAnswer = await getWikipediaInfo(q);
        if (wikiAnswer) {
            return "📚 উইকিপিডিয়া থেকে:\n" + wikiAnswer;
        }

        // ৩. নিউজ চেক
        var newsAnswer = await getNews(q);
        if (newsAnswer) {
            return newsAnswer;
        }

        // ৪. কিছুই না পেলে
        return "🤔 স্যার, আমি এই বিষয়ে তথ্য পাচ্ছি না। দয়া করে আরও সহজভাবে প্রশ্নটি বলুন।";
    }

    // ============================================
    // ৭. মেসেজ যোগ করার ফাংশন
    // ============================================
    function addMessage(sender, text) {
        var msgDiv = document.createElement('div');
        msgDiv.className = sender === 'advisor' ? 'advisor-msg' : 'user-msg';
        msgDiv.innerHTML = text.replace(/\n/g, '<br>');
        chatBox.appendChild(msgDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // ============================================
    // ৮. SEND বাটন (Async)
    // ============================================
    sendBtn.addEventListener('click', async function() {
        var msg = userInput.value.trim();
        if (msg === '') return;

        addMessage('user', msg);
        
        // লোডিং মেসেজ
        var loadingId = 'loading-' + Date.now();
        var loadingDiv = document.createElement('div');
        loadingDiv.className = 'advisor-msg';
        loadingDiv.id = loadingId;
        loadingDiv.innerHTML = '🤔 খুঁজছি...';
        chatBox.appendChild(loadingDiv);
        chatBox.scrollTop = chatBox.scrollHeight;

        var reply = await getAdvisorReply(msg);
        
        // লোডিং মেসেজ রিপ্লেস
        var loadingElement = document.getElementById(loadingId);
        if (loadingElement) {
            loadingElement.innerHTML = reply.replace(/\n/g, '<br>');
        }
        userInput.value = '';
    });

    // এন্টার প্রেস
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') sendBtn.click();
    });

    // ============================================
    // ৯. কুইক অ্যাকশন বাটন
    // ============================================
    actionBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            var action = this.dataset.action;
            var question = '';
            if (action === 'idea') question = 'ব্যবসার আইডিয়া দিন';
            else if (action === 'profit') question = 'লাভ কীভাবে বাড়াব?';
            else if (action === 'market') question = 'মার্কেটিং টিপস দিন';
            else if (action === 'invest') question = 'বিনিয়োগ পরামর্শ দিন';
            else if (action === 'document') question = 'ডকুমেন্ট প্রস্তাব তৈরি করুন';
            userInput.value = question;
            sendBtn.click();
        });
    });

    // ============================================
    // ১০. চিপস (দ্রুত প্রশ্ন)
    // ============================================
    chips.forEach(function(chip) {
        chip.addEventListener('click', function() {
            userInput.value = this.dataset.question;
            sendBtn.click();
        });
    });

}); // DOMContentLoaded শেষ