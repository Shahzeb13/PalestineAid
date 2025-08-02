

exports.handleChat = async (req, res) => {
    const { prompt } = req.body;
    const msg = prompt.toLowerCase();

    let reply = "I'm sorry, I didn't understand that. Could you rephrase it?";

    // Greetings and basic interactions
    if (
        msg.includes("hi") ||
        msg.includes("hello") ||
        msg.includes("hey") ||
        msg.includes("salam") ||
        msg.includes("assalamu alaikum") ||
        msg.includes("how are you")
    ) {
        reply = "Wa Alaikum Assalam 👋 I'm your NusrahPalestine assistant. We're here to help Palestinians in Gaza with emergency aid, medical supplies, food, and shelter. How can I assist you today? 🤲";
    }

    // Who are donations for
    else if (
        msg.includes("who") && msg.includes("donation") ||
        msg.includes("who") && msg.includes("donate") ||
        msg.includes("who") && msg.includes("help") ||
        msg.includes("who") && msg.includes("for") ||
        msg.includes("beneficiaries") ||
        msg.includes("recipients") ||
        msg.includes("families") ||
        msg.includes("children") ||
        msg.includes("gaza") && msg.includes("people")
    ) {
        reply = "Our donations go directly to Palestinian families in Gaza who are facing severe humanitarian crises. This includes: 👨‍👩‍👧‍👦\n• Children and families in need\n• Medical patients requiring treatment\n• Displaced families without shelter\n• Elderly and vulnerable individuals\n• Emergency response teams\n\nEvery donation makes a real difference in their lives! 💚";
    }

    // How to donate
    else if (
        msg.includes("how") && msg.includes("donate") ||
        msg.includes("how") && msg.includes("give") ||
        msg.includes("how") && msg.includes("help") ||
        msg.includes("donation") && msg.includes("process") ||
        msg.includes("donate") && msg.includes("money") ||
        msg.includes("payment") ||
        msg.includes("contribute")
    ) {
        reply = "Donating is easy! 💚\n1. Click the green 'Donate Now' button\n2. Choose your donation amount\n3. Select one-time or monthly donation\n4. Enter your payment details securely\n5. Receive instant confirmation\n\nYou can donate any amount - every dollar counts! 🙏";
    }

    // Safety and security concerns
    else if (
        msg.includes("safe") ||
        msg.includes("secure") ||
        msg.includes("trust") ||
        msg.includes("reliable") ||
        msg.includes("legitimate") ||
        msg.includes("scam") ||
        msg.includes("fraud") ||
        msg.includes("protection") ||
        msg.includes("encryption") ||
        msg.includes("stripe")
    ) {
        reply = "Absolutely! 🔒\n• We use Stripe (world's most secure payment processor)\n• All transactions are encrypted with SSL\n• Your financial data is never stored on our servers\n• We're fully transparent about fund usage\n• 100% of donations go to aid (minus processing fees)\n• We have direct partnerships with local organizations\n\nYour security is our top priority! 🛡️";
    }

    // What donations provide
    else if (
        msg.includes("what") && msg.includes("provide") ||
        msg.includes("what") && msg.includes("buy") ||
        msg.includes("what") && msg.includes("get") ||
        msg.includes("impact") ||
        msg.includes("difference") ||
        msg.includes("help") && msg.includes("provide") ||
        msg.includes("money") && msg.includes("used") ||
        msg.includes("funds") && msg.includes("used")
    ) {
        reply = "Your donation makes a real impact! 📦\n• $25 = Emergency food package for a family\n• $50 = Medical supplies for 10 patients\n• $100 = Shelter materials for displaced families\n• $200 = Clean water for 50 people\n• $500 = Complete emergency kit for a family\n\nEvery amount directly helps those in need! 💝";
    }

    // Monthly donations
    else if (
        msg.includes("monthly") ||
        msg.includes("recurring") ||
        msg.includes("subscription") ||
        msg.includes("regular") ||
        msg.includes("ongoing") ||
        msg.includes("sustained") ||
        msg.includes("cancel") && msg.includes("monthly")
    ) {
        reply = "Yes! Monthly donations are crucial for sustained aid 📅\n• Choose 'Monthly' when donating\n• Cancel anytime from your account\n• Receive monthly impact reports\n• Help provide consistent support\n• Even $10/month makes a huge difference!\n\nMonthly donations help us plan long-term relief efforts! 🌟";
    }

    // Transparency and tracking
    else if (
        msg.includes("transparency") ||
        msg.includes("track") ||
        msg.includes("follow") ||
        msg.includes("where") && msg.includes("money") ||
        msg.includes("how") && msg.includes("know") ||
        msg.includes("reports") ||
        msg.includes("updates") ||
        msg.includes("verification") ||
        msg.includes("accountability")
    ) {
        reply = "We maintain complete transparency! 📊\n• Weekly updates on fund distribution\n• Photos and videos from the field\n• Detailed financial reports\n• Direct partnerships with local organizations\n• Real-time tracking of aid delivery\n• Regular impact assessments\n\nYou can see exactly how your donation helps! 📸";
    }

    // Small donations
    else if (
        msg.includes("small") ||
        msg.includes("little") ||
        msg.includes("afford") ||
        msg.includes("poor") ||
        msg.includes("broke") ||
        msg.includes("money") && msg.includes("enough") ||
        msg.includes("minimum") ||
        msg.includes("least") ||
        msg.includes("cheap")
    ) {
        reply = "Every amount matters! 💝\n• $5 can provide clean water for a child\n• $10 buys essential medicine\n• $15 provides a warm meal\n• Even $1 helps when many people give\n• Share our cause with friends and family\n\nSmall donations add up to make a huge impact! 🌟";
    }

    // Alternative ways to help
    else if (
        msg.includes("volunteer") ||
        msg.includes("help") && msg.includes("other") ||
        msg.includes("ways") && msg.includes("help") ||
        msg.includes("support") && msg.includes("other") ||
        msg.includes("share") ||
        msg.includes("spread") ||
        msg.includes("awareness") ||
        msg.includes("pray") ||
        msg.includes("prayer")
    ) {
        reply = "Absolutely! There are many ways to help 🤝\n• Share our donation links on social media\n• Organize fundraising events\n• Spread awareness about the crisis\n• Pray for the people of Palestine\n• Contact us about volunteer opportunities\n• Tell friends and family about our cause\n\nEvery action counts! 🙏";
    }

    // Emergency and urgency
    else if (
        msg.includes("emergency") ||
        msg.includes("urgent") ||
        msg.includes("crisis") ||
        msg.includes("desperate") ||
        msg.includes("immediate") ||
        msg.includes("now") ||
        msg.includes("quick") ||
        msg.includes("fast")
    ) {
        reply = "The situation in Gaza is indeed urgent! 🚨\n• Families are in desperate need of food and water\n• Medical supplies are critically low\n• Many are displaced and without shelter\n• Children are suffering from malnutrition\n• Every day counts in saving lives\n\nYour donation can provide immediate relief! ⚡";
    }

    // Medical aid
    else if (
        msg.includes("medical") ||
        msg.includes("medicine") ||
        msg.includes("health") ||
        msg.includes("hospital") ||
        msg.includes("doctor") ||
        msg.includes("treatment") ||
        msg.includes("medicine") ||
        msg.includes("sick") ||
        msg.includes("injured")
    ) {
        reply = "Medical aid is critical in Gaza! 🏥\n• Hospitals are overwhelmed and under-resourced\n• Many patients need life-saving treatments\n• Medical supplies are running dangerously low\n• Children need vaccines and basic care\n• Emergency surgeries are delayed due to lack of supplies\n\nYour donation helps provide essential medical care! 💊";
    }

    // Food and nutrition
    else if (
        msg.includes("food") ||
        msg.includes("hunger") ||
        msg.includes("starve") ||
        msg.includes("nutrition") ||
        msg.includes("meal") ||
        msg.includes("eat") ||
        msg.includes("feed") ||
        msg.includes("malnutrition")
    ) {
        reply = "Food security is a major crisis in Gaza! 🍽️\n• Many families don't know where their next meal will come from\n• Children are suffering from malnutrition\n• Food prices have skyrocketed\n• Access to clean water is limited\n• Emergency food packages provide immediate relief\n\nYour donation helps feed hungry families! 🥘";
    }

    // Shelter and housing
    else if (
        msg.includes("shelter") ||
        msg.includes("house") ||
        msg.includes("home") ||
        msg.includes("displaced") ||
        msg.includes("refugee") ||
        msg.includes("camp") ||
        msg.includes("roof") ||
        msg.includes("tent")
    ) {
        reply = "Many families in Gaza are displaced and homeless! 🏠\n• Thousands have lost their homes\n• Many are living in temporary shelters\n• Winter is coming and they need proper housing\n• Children need safe places to sleep\n• Emergency shelter materials are urgently needed\n\nYour donation helps provide safe shelter! 🏘️";
    }

    // Water and sanitation
    else if (
        msg.includes("water") ||
        msg.includes("drink") ||
        msg.includes("clean") ||
        msg.includes("sanitation") ||
        msg.includes("hygiene") ||
        msg.includes("wash") ||
        msg.includes("thirsty")
    ) {
        reply = "Access to clean water is a major crisis! 💧\n• Many people don't have access to clean drinking water\n• Waterborne diseases are spreading\n• Children are getting sick from contaminated water\n• Basic hygiene is difficult without clean water\n• Water purification systems are desperately needed\n\nYour donation helps provide clean water! 🚰";
    }

    // Children and education
    else if (
        msg.includes("child") ||
        msg.includes("kid") ||
        msg.includes("student") ||
        msg.includes("school") ||
        msg.includes("education") ||
        msg.includes("learn") ||
        msg.includes("study") ||
        msg.includes("baby") ||
        msg.includes("infant")
    ) {
        reply = "Children are the most vulnerable in this crisis! 👶\n• Many children are orphaned or separated from families\n• Schools have been destroyed or damaged\n• Children need basic supplies like clothes and toys\n• Education has been disrupted\n• Many children are traumatized and need psychological support\n\nYour donation helps protect and support children! 🎒";
    }

    // Thank you responses
    else if (
        msg.includes("thank") ||
        msg.includes("thanks") ||
        msg.includes("grateful") ||
        msg.includes("appreciate") ||
        msg.includes("bless") ||
        msg.includes("allah") && msg.includes("reward")
    ) {
        reply = "JazakAllah Khair! 🙏\nYour support means the world to families in Gaza. Together, we can make a real difference. Don't forget to share our cause with others. Every donation, no matter how small, brings hope to someone in need. May Allah reward you abundantly! 💚";
    }

    // Goodbye and farewell
    else if (
        msg.includes("bye") ||
        msg.includes("goodbye") ||
        msg.includes("farewell") ||
        msg.includes("see") && msg.includes("later") ||
        msg.includes("take") && msg.includes("care") ||
        msg.includes("exit") ||
        msg.includes("close")
    ) {
        reply = "Thank you for your time! 🤗\nIf you have any more questions about donating to help Palestinians in Gaza, feel free to ask. Remember, every donation counts and makes a real difference. Assalamu Alaikum! 🙏";
    }

    // Contact information
    else if (
        msg.includes("contact") ||
        msg.includes("email") ||
        msg.includes("phone") ||
        msg.includes("reach") ||
        msg.includes("support") && msg.includes("team") ||
        msg.includes("help") && msg.includes("contact")
    ) {
        reply = "You can reach our support team through:\n📧 Email: support@nusrahpalestine.com\n📱 Phone: +1-800-PALESTINE\n💬 Live chat: Available 24/7\n📧 Contact form: On our website\n\nWe're here to help with any questions! 🤝";
    }

    // Website and social media
    else if (
        msg.includes("website") ||
        msg.includes("social") ||
        msg.includes("facebook") ||
        msg.includes("instagram") ||
        msg.includes("twitter") ||
        msg.includes("link") ||
        msg.includes("url")
    ) {
        reply = "Stay connected with us:\n🌐 Website: www.nusrahpalestine.com\n📘 Facebook: @NusrahPalestine\n📷 Instagram: @nusrahpalestine\n🐦 Twitter: @NusrahPalestine\n📱 WhatsApp: +1-800-PALESTINE\n\nFollow us for updates and impact stories! 📱";
    }

    // Donation amounts and suggestions
    else if (
        msg.includes("amount") ||
        msg.includes("how much") ||
        msg.includes("suggest") ||
        msg.includes("recommend") ||
        msg.includes("minimum") ||
        msg.includes("maximum") ||
        msg.includes("average")
    ) {
        reply = "We accept donations of any amount! 💰\n• Suggested amounts: $25, $50, $100, $200, $500\n• No minimum donation required\n• Every dollar makes a difference\n• Monthly donations start at $10\n• Large donations can be arranged via email\n\nChoose an amount that feels right for you! 💝";
    }

    // Tax deductions and receipts
    else if (
        msg.includes("tax") ||
        msg.includes("deduction") ||
        msg.includes("receipt") ||
        msg.includes("invoice") ||
        msg.includes("proof") ||
        msg.includes("document") ||
        msg.includes("certificate")
    ) {
        reply = "Yes, donations are tax-deductible! 📄\n• You'll receive an email receipt immediately\n• Tax-deductible receipts sent annually\n• Keep your donation confirmation for tax purposes\n• We're a registered 501(c)(3) organization\n• Contact us for any receipt issues\n\nYour generosity is also tax-smart! 💼";
    }

    // International donations
    else if (
        msg.includes("international") ||
        msg.includes("country") ||
        msg.includes("foreign") ||
        msg.includes("currency") ||
        msg.includes("dollar") ||
        msg.includes("euro") ||
        msg.includes("pound") ||
        msg.includes("canada") ||
        msg.includes("uk") ||
        msg.includes("australia")
    ) {
        reply = "We accept donations from around the world! 🌍\n• Multiple currencies supported\n• Secure international payment processing\n• Real-time currency conversion\n• No extra fees for international donations\n• Tax benefits available in many countries\n\nHelp from anywhere in the world! 🌎";
    }

    // Impact stories and testimonials
    else if (
        msg.includes("story") ||
        msg.includes("testimonial") ||
        msg.includes("impact") && msg.includes("story") ||
        msg.includes("success") ||
        msg.includes("result") ||
        msg.includes("outcome") ||
        msg.includes("before") && msg.includes("after")
    ) {
        reply = "We have many inspiring impact stories! 📖\n• Families reunited through our aid\n• Children receiving life-saving medical care\n• Communities rebuilding with our support\n• Emergency responses saving lives\n• Long-term development projects\n\nRead our impact stories on our website! 📚";
    }

    // Partnership and collaboration
    else if (
        msg.includes("partner") ||
        msg.includes("collaborate") ||
        msg.includes("organization") ||
        msg.includes("ngo") ||
        msg.includes("charity") ||
        msg.includes("foundation") ||
        msg.includes("corporate") ||
        msg.includes("business")
    ) {
        reply = "We welcome partnerships! 🤝\n• Corporate partnerships for large-scale projects\n• NGO collaborations for specialized aid\n• Community organization partnerships\n• International aid organization cooperation\n• Local Gaza-based partner organizations\n\nContact us to discuss partnership opportunities! 📧";
    }

    // Crisis updates and current situation
    else if (
        msg.includes("crisis") ||
        msg.includes("situation") ||
        msg.includes("update") ||
        msg.includes("current") ||
        msg.includes("latest") ||
        msg.includes("news") ||
        msg.includes("condition") ||
        msg.includes("status")
    ) {
        reply = "The situation in Gaza remains critical! 🚨\n• Ongoing humanitarian crisis\n• Limited access to basic necessities\n• Medical facilities overwhelmed\n• Food and water shortages\n• Displacement affecting thousands\n\nWe provide regular updates on our website and social media! 📰";
    }

    // Prayer and spiritual support
    else if (
        msg.includes("pray") ||
        msg.includes("prayer") ||
        msg.includes("dua") ||
        msg.includes("spiritual") ||
        msg.includes("faith") ||
        msg.includes("allah") ||
        msg.includes("god") ||
        msg.includes("blessing")
    ) {
        reply = "Prayers are powerful and always welcome! 🤲\n• We believe in the power of collective prayer\n• Many volunteers pray for the people of Gaza\n• Spiritual support is as important as material aid\n• We organize prayer circles and events\n• Your prayers make a real difference\n\nKeep the people of Palestine in your prayers! 🙏";
    }

    // Default response for unrecognized queries
    else {
        reply = "I'm here to help you with questions about donating to help Palestinians in Gaza! 💚\n\nYou can ask me about:\n• How to donate\n• Who receives the aid\n• Safety and security\n• Impact of donations\n• Monthly giving\n• Transparency\n• And much more!\n\nWhat would you like to know? 🤔";
    }

    res.json({ reply });
};