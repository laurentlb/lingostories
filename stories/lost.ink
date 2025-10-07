Lost & Found #title

VAR found_pages = 0

-> START

=== START ===
You arrive at school, balancing your backpack on your shoulder. The morning bell will ring soon, echoing through the halls.  

As you reach into your bag, your stomach drops.  
Your **red notebook with a banana sticker on the cover** is missing!  

This isn’t just any notebook—it has your homework, class notes, and even some doodles you’d rather no one else saw. The teacher asked everyone to bring their homework today, and yours is in that notebook.  

Anna, your best friend, notices your pale face and wide eyes.  
ANNA: "Whoa, what happened? You look like you saw a ghost."  

You: "My notebook. It’s gone. All my homework’s in there!"  

ANNA gasps dramatically, then raises one eyebrow.  
ANNA: "Don’t panic, detective! Every great mystery begins with a missing item."  

She presses her hand to her chin like Sherlock Holmes and paces in a circle, pretending to think.  

ANNA: "Step one, examine the scene of the crime. Step two, question the suspects. Step three, follow the trail. Ta-da!"  

Despite your panic, you can’t help but smile. Anna always finds a way to make things ridiculous.  

Where should you start?

ANNA: "Let’s solve this mystery together! Where should we start?"
+ [Go to the library.] -> LIBRARY
+ [Go to the hallway.] -> HALLWAY
+ [Search around the classroom.] -> CLASSROOM_SEARCH  

// + [Ask Anna for help.] -> ANNA_HELP  
// + [Head into the hallway.] -> HALLWAY

=== CLASSROOM_SEARCH ===
You scan the classroom before leaving. The teacher hasn’t arrived yet, and other students are busy chatting, throwing paper airplanes, and sneaking snacks.  

Anna whispers dramatically: "Classic detective move. Always check the crime scene first."  

Where should you look?  

+ [Peek inside the teacher’s desk.] -> TEACHER_DESK  
+ [Check the classroom lost-and-found box.] -> LOST_FOUND_BOX  
+ [Ask a classmate nearby.] -> CLASSROOM_CLASSMATE  

=== TEACHER_DESK ===
You tug gently on the teacher’s desk drawer. It squeaks open, revealing stacks of papers, chalk, and… a notebook!  

Your heart leaps—until you pull it out and realize it’s green, not red.  

ANNA bursts out laughing.  
ANNA: "Detective, clue analysis: wrong color. You almost solved the wrong case!"  

You sigh and slide the green notebook back. At least you tried.  
-> HALLWAY  

=== LOST_FOUND_BOX ===
At the back of the room, there’s a dusty lost-and-found box. You dig through scarves, socks, a broken calculator, and even an old lunchbox that smells like mystery meat.  

At the bottom, you spot a crumpled page with your handwriting on it!  

ANNA claps her hands.  
ANNA: "Score! One page closer. You’re a natural detective already."  
~ found_pages += 1  

You carefully tuck it into your pocket before heading out.  

-> HALLWAY  

=== CLASSROOM_CLASSMATE ===
You lean toward a classmate doodling in his notebook.  
You: "Hey, have you seen a red notebook with a banana sticker?"  

CLASSMATE smirks: "Oh, sure. Here it is."  

Excited, you snatch the notebook and flip it open—only to find it full of silly banana cartoons, some with sunglasses, others with mustaches.  

Anna nearly falls over laughing.  
ANNA: "It’s… it’s the Banana Gang! Case closed!"  

CLASSMATE: "Gotcha! That’s my art project."  
He snickers as you roll your eyes.  

Prank. But at least it lightened the mood.  
-> HALLWAY



=== LIBRARY ===
You push open the library doors. The room smells faintly of dust and ink. Tall shelves stretch like silent towers, and sunlight filters through the high windows.  

The librarian peers at you over her glasses, a finger to her lips.  
LIBRARIAN: "Shh! This is a quiet space."  

Anna whispers dramatically:  
ANNA: "Detectives must search in silence… unless they find something shocking."  
She tiptoes forward, clearly enjoying herself.  

Where should you look first?  

+ [Ask the librarian directly.] -> LIB_LIBRARIAN  
+ [Search between the shelves.] -> LIB_SHELVES  
+ [Check the reading tables.] -> LIB_TABLES  
+ [Talk to the classmate in the corner.] -> LIB_CLASSMATE  

=== LIB_LIBRARIAN ===
You step up to the desk and explain about your missing notebook.  
The librarian adjusts her glasses and leans closer.  

LIBRARIAN: "Hmm… I did notice a notebook earlier. Red cover, banana sticker. Very unusual choice, I must say. Pages were slipping out as if it were shedding."  

She pulls open a drawer and hands you a loose sheet.  
LIBRARIAN: "This page fell onto the floor when the janitor walked by."  

ANNA gasps softly.  
ANNA: "The janitor again! He’s everywhere."  
~ found_pages += 1  

The librarian gives a tiny smile.  
LIBRARIAN: "He does wander a lot. Always taping odd things to the notice boards."  

You pocket the page and nod gratefully.  
-> CAFETERIA  

=== LIB_SHELVES ===
The shelves tower over you, books packed tightly together. You trail your hand along the spines until—*thud!*—a heavy dictionary slips free and lands on the floor.  

Inside its pages, something flutters out. It’s a sheet with your handwriting.  

ANNA picks it up like it’s treasure.  
ANNA: "Detective success! Dictionary of Secrets: now with bonus homework."  
~ found_pages += 1  

You tuck it away.  
+ [Keep searching around the shelves.] -> LIB_EXPLORE  
+ [Show it to the librarian.] -> LIB_LIBRARIAN  





=== LIB_EXPLORE ===
As you wander deeper between the stacks, the silence feels heavier. On one shelf, a sketchbook is left open, showing doodles of… banana stickers?  

ANNA leans in, whispering: "Our suspect leaves his mark everywhere. This janitor is basically a banana bandit."  

You grin, shaking your head.  
+ [Check the reading tables.] -> LIB_TABLES  
+ [Leave for the cafeteria.] -> CAFETERIA  

=== LIB_TABLES ===
The reading tables are scattered with notebooks, pens, and half-finished assignments.  

You crouch under one chair and discover a crumpled page taped with a banana sticker.  

ANNA groans dramatically:  
ANNA: "He’s turned the whole school into a scrapbook!"  
~ found_pages += 1  

You carefully fold the page and glance at the exit.  
-> CAFETERIA  

=== LIB_CLASSMATE ===
In the far corner, a classmate is pretending to read but really watching everyone else.  

You: "Hey, did you see a red notebook with a banana sticker?"  
CLASSMATE smirks: "Maybe. I see lots of things."  

Anna folds her arms.  
ANNA: "Cut the act. Just tell us."  

The classmate shrugs.  
CLASSMATE: "Fine. I saw the janitor carrying something like that. He was heading toward the cafeteria."  

Anna raises her eyebrows.  
ANNA: "Banana Bandit confirmed."  

You thank them and head out.  
-> CAFETERIA

=== CAFETERIA ===
The cafeteria buzzes with life. Trays clatter, students laugh, and the smell of soup mixes with the buttery scent of bread.  

Anna takes a deep sniff.  
ANNA: "Detective rule number one: never investigate on an empty stomach. But okay, let’s focus!"  

You scan the room. So many people, so many places where a notebook—or its pages—could be hiding.  

Where should you look?  

+ [Search between the tables.] -> CAF_TABLES  
+ [Peek into the kitchen.] -> CAF_COOK  
+ [Check the notice board on the wall.] -> NOTICE_BOARD  
+ [Talk to the group of students gossiping.] -> CAF_GOSSIP  

=== CAF_TABLES ===
You weave through the maze of tables, careful not to trip on stray backpacks. Suddenly—*splat!*—orange juice spills across the floor.  

A student had bumped into you, tray wobbling.  
STUDENT: "Oh no! Sorry, sorry!"  

Anna laughs as she helps you up.  
ANNA: "Detective down! But wait—what’s that stuck to your shoe?"  

You peel it off: a juice-stained page from your notebook.  

ANNA: "Gross but valuable. Evidence secured!"  
~ found_pages += 1  

+ [Keep searching around the tables.] -> CAF_PRANK  
+ [Move on to the kitchen.] -> CAF_COOK  

=== CAF_PRANK ===
As you dry your hands, another student waves you over.  
STUDENT (smirking): "Looking for a red notebook? I’ve got it."  

He hands you a notebook. Excited, you open it—only to find doodles of superheroes shaped like bananas.  

Anna bursts out laughing.  
ANNA: "First the Banana Gang, now Banana-Man? This school is bananas!"  

You sigh, handing it back.  
STUDENT (grinning): "Couldn’t resist."  
-> CAF_EXPLORE  

=== CAF_EXPLORE ===
Anna glances around the cafeteria, scanning the chaos.  
ANNA: "Okay, detective. We got a page, we got pranked, and I’m still hungry. What’s next?"  

+ [Head toward the kitchen.] -> CAF_COOK  
+ [Talk to the gossiping students.] -> CAF_GOSSIP  
+ [Leave for the hallway.] -> HALLWAY  

=== CAF_COOK ===
You peek through the swinging doors into the kitchen. A cook stirs a massive pot of soup, steam clouding his glasses.  

COOK (grumbling): "Students again? This is a kitchen, not a playground!"  
* You: "Sorry! We’re looking for a red notebook."
* You: "Sorry, we’ll leave!" -> HALLWAY
-


COOK snorts.  
COOK: "Red cover, banana sticker? Yeah, the janitor dropped it in here earlier. Pages everywhere, like snow!"  

He points to the corner, where a page is stuck under a crate.  
You grab it quickly.  
~ found_pages += 1  

Anna waves it like a trophy.  
ANNA: "Case progress! Detective duo strikes again."  

COOK shakes his ladle.  
COOK: "Tell that janitor to keep his junk out of my kitchen, or next time it’s going in the soup!"  

You grin awkwardly and retreat.  
-> HALLWAY  

=== CAF_GOSSIP ===
Near the wall, three students huddle together, whispering.  

STUDENT1: "I heard the janitor has a secret sticker collection. He even puts them on notebooks!"  
STUDENT2: "Yeah, I saw him with a red notebook earlier. He was heading toward the hallway."  
STUDENT3: "Weird guy. Always muttering to himself."  

Anna leans closer, whispering back at you.  
ANNA: "Well, mystery solved. The janitor’s officially guilty until proven innocent."  

-> HALLWAY  

=== NOTICE_BOARD ===
You stop by the cafeteria notice board. Posters cover half the wall—club meetings, sports tryouts, a “Lost Sock” announcement.  

Anna squints.  
ANNA: "Wait, what’s that peeking out?"  

You peel back a flyer and find another notebook page, taped with—you guessed it—a banana sticker.  

ANNA: "Banana Bandit strikes again. Honestly, he’s leaving a trail even *I* can follow."  
~ found_pages += 1  

-> HALLWAY



=== HALLWAY ===
The hallway is alive with echoes—lockers slamming, sneakers squeaking, and voices bouncing off the walls. Students rush past in both directions.  

Anna nudges you.  
ANNA: "Okay, detective, the janitor’s closet is at the far end. But remember—hallways are where secrets hide."  

You glance around. Where should you go?  

+ [Talk to the gossiping students.] -> GOSSIP  
+ [Speak with a teacher passing by.] -> HALLWAY_TEACHER  
+ [Check the notice board again.] -> NOTICE_BOARD2  
+ [Head directly to the janitor’s room.] -> JANITOR_ROOM  


=== GOSSIP ===
You press against the lockers, listening in on two older students.  

STUDENT1: "That janitor’s so strange. He collects banana stickers like they’re treasure."  
STUDENT2: "Yeah, and I swear I saw him with a red notebook. Pretty sure it wasn’t his."  

They both laugh nervously.  
Anna whispers:  
ANNA: "Banana Bandit confirmed. Exhibit A: gossip evidence."  

You grin and move on.  
-> JANITOR_ROOM  


=== HALLWAY_TEACHER ===
As you head down the hall, a teacher carrying a stack of papers stops you.  

TEACHER: "Why aren’t you in class? The bell hasn’t rung yet, but you look suspicious."  

You: "We’re, uh… on a detective mission."  
Anna jumps in dramatically.  
ANNA: "A crucial one, involving a missing notebook and a dangerous sticker enthusiast."  

The teacher raises an eyebrow.  
TEACHER: "Well, I *did* pick up a strange page outside the staffroom earlier. If this helps your… investigation."  

He hands you a notebook page.  
~ found_pages += 1  

Anna bows like she’s on stage.  
ANNA: "Thank you, citizen. Justice will be served!"  

The teacher sighs, clearly regretting his choice, and walks away.  
-> JANITOR_ROOM  


=== NOTICE_BOARD2 ===
You pause at another notice board. Posters for the school play and chess club flutter in the hallway breeze.  

Anna points at something shiny under a flyer.  
ANNA: "Another sticker sighting!"  

You peel the flyer back and find a notebook page carefully taped beneath it.  

ANNA: "He’s treating the whole school like his personal scrapbook."  
~ found_pages += 1  

-> JANITOR_ROOM  


=== JANITOR_ROOM ===
You reach the janitor’s closet. The door is half open, creaking slightly. Inside, the air smells of cleaning supplies and old wood.  

On the desk lies your red notebook, banana sticker glinting under the flickering light. Nearby, loose pages are stacked haphazardly, some taped with more stickers.  

The janitor looks up, startled.  
JANITOR: "What are you kids doing here? This is no place for students."  

Anna points straight at the notebook.  
ANNA: "That belongs to us! You’ve been caught red-handed."  

The janitor frowns, leaning back in his chair.  
JANITOR: "Caught? I was keeping it safe. Nothing more."  

How do you respond?  

+ [Accuse him directly.] -> JANITOR_DIRECT  
+ [Ask politely for the notebook.] -> JANITOR_POLITE  
+ [Offer a trade.] -> JANITOR_BRIBE  

=== JANITOR_DIRECT ===
You cross your arms and glare.  
You: "You’ve been stealing notebooks, haven’t you?"  

The janitor slams the notebook shut and stands up.  
JANITOR: "Stealing? Nonsense! It was falling apart—pages dropping everywhere like confetti. I was only trying to protect it."  

Anna narrows her eyes.  
ANNA: "Protect it with banana stickers? You turned it into a fruit salad."  

The janitor sighs, shoulders slumping.  
JANITOR: "They’re not just stickers. They’re part of my collection. I like things simple, bright, and… cheerful. It helps me when the work is heavy."  

Anna’s frown softens slightly, but she whispers:  
ANNA: "Still weird."

  

-> JANITOR_CONFESSION  

=== JANITOR_POLITE ===
You step forward carefully.  
You: "Please, sir. That notebook belongs to me. Could we have it back?"  

The janitor hesitates, tapping the cover.  
JANITOR: "It’s been lying around the school all day. I just wanted to keep it safe."  

He slowly slides it toward you.  
JANITOR: "But don’t mock my stickers. They matter to me."  

Anna nods gently.  
ANNA: "We won’t laugh. But you confused the whole school."  

The janitor sighs.  
-> JANITOR_CONFESSION  

=== JANITOR_BRIBE ===
You dig into your pocket and pull out a shiny pen.  
You: "What if we trade? This pen for the notebook."  

The janitor chuckles, the lines on his face easing.  
JANITOR: "Kids these days… always bargaining. Fine. Take the notebook. But the stickers stay with me."  

Anna smirks:  
ANNA: "Detective business expense: one pen down, one notebook recovered."  

-> JANITOR_CONFESSION  

=== JANITOR_CONFESSION ===
The janitor rubs his forehead and sits back down heavily.  

JANITOR: "I wasn’t trying to steal. I only wanted to learn. I practice reading the sentences in the notebook… They help me understand better. My job doesn’t give me time for classes, but reading… it’s something."  

Anna tilts her head, suddenly softer.  
ANNA: "So you’re like a secret student too?"  

The janitor nods, embarrassed.  
JANITOR: "Maybe. But I shouldn’t have hidden it. I just didn’t want anyone to laugh at me."  

You glance at Anna, then back at him.  
You: "We’re not laughing. But this notebook is important. It belongs in the right hands."  

The janitor slowly pushes the stack of loose pages toward you.  
JANITOR: "Take them. You’ve worked hard to gather the rest. You deserve it."  

Anna gathers the pages with a triumphant grin.  
ANNA: "Detective case nearly solved! Time to count the evidence."  

The janitor chuckles quietly.  
JANITOR: "You two are sharper than I thought."  

-> ENDINGS  

=== SCHOOLYARD_OPTION ===
On your way back from the janitor’s room, Anna tugs your sleeve.  
ANNA: "Wait, detective! Before we head to class, what if the trail continues outside? A true investigator checks *everywhere*."  

You hesitate, but curiosity wins. Together, you step into the schoolyard.  

The fresh air smells of grass and chalk dust from the hopscotch squares. A soccer ball rolls past, followed by kids chasing it.  

Near the fence, you spot something fluttering.  

ANNA: "Could it be… another page?"  

You rush over and peel a notebook sheet off the fence. It’s taped with—of course—a banana sticker.  

ANNA (dramatically): "Banana Bandit’s final clue! Case closed with style."  
~ found_pages += 1  

With a satisfied smile, you and Anna head back inside as the bell rings.  
-> ENDINGS  


=== ENDINGS ===
You hold the notebook in your hands at last, the bell echoing through the halls.  

Anna leans close, eyes sparkling.  
ANNA: "Well, detective… how did we do?"  

{
- found_pages == 0:
    You flip through the notebook. It’s nearly empty.  
    ANNA: "We barely found anything. At least we’re on time for class."  
    You sigh: "Next time, we’ll search harder."  
    The janitor shrugs: "Fast detectives, but careless ones."  
    -> END
 - found_pages < 3:
    You notice gaps where pages should be.  
    ANNA: "Some pieces are missing, but at least we returned most of it."  
    You: "Good effort for today. Maybe we’ll complete it another time."  
    janitor: "Not perfect, but good."  
    -> END
- else:
    You proudly stack the recovered pages into the notebook. It’s complete.  
    The janitor shakes his head in disbelief.  
    JANITOR: "You two are sharper than I thought. Real detectives."  
    Anna grins and raises the notebook high.  
    ANNA: "Case closed! Detective agency officially open: Banana Sticker Crimes, Inc.!"  
    You both burst out laughing, earning a curious look from passing students.  
    -> END
}

=== END ===
The bell rings louder, and you hurry to class with Anna at your side. The case is over—for now.  
But you can’t help wondering what the next mystery will be.  
-> DONE

