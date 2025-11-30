Lost & Found #title

VAR found_pages = 0

-> START

=== START ===
You arrive at school, balancing your backpack on your shoulder.
The morning bell will ring soon.

As you reach into your bag, your stomach sinks.
Your red notebook with a banana sticker on the cover is gone!

This isn’t just any notebook.
It has your homework, class notes, and even some doodles you’d rather no one saw.
The teacher asked everyone to bring homework today, and yours is in that notebook.

Anna, your best friend, notices your pale face and wide eyes.
@ANNA Whoa! What happened? You look like you saw a ghost.

@You My notebook. It’s gone. All my homework’s in there!

Anna gasps loudly, then raises one eyebrow.
@ANNA Don’t panic, detective! Every mystery begins with something missing.

She presses her hand to her chin and walks in a small circle, pretending to think.

@ANNA Step one, look at the scene.
@ANNA Step two, ask questions.
@ANNA Step three, follow the clues. Ta-da!

Even though you’re nervous, you smile. Anna always makes things funny.

@ANNA Let’s solve this together! Where should we start?

+ [Go to the library.] -> LIBRARY
+ [Go to the hallway.] -> HALLWAY
+ [Search around the classroom.] -> CLASSROOM_SEARCH

=== CLASSROOM_SEARCH ===
You look around the classroom before leaving.
The teacher hasn’t arrived yet.
The students are talking, throwing paper airplanes, and sneaking snacks.

@Anna Good move, detective. Always start where it happened.

+ [Peek inside the teacher’s desk.] -> TEACHER_DESK
+ [Check the classroom lost-and-found box.] -> LOST_FOUND_BOX
+ [Ask a classmate nearby.] -> CLASSROOM_CLASSMATE

=== TEACHER_DESK ===
You pull gently on the teacher’s desk drawer.
It squeaks open.
Papers, chalk, and… a notebook!

Your heart jumps, until you see it’s orange, not red.

Anna laughs.
@ANNA Detective note: wrong color.
@ANNA Close, but not the one!

You sigh and slide the orange notebook back. At least you tried.
-> HALLWAY

=== LOST_FOUND_BOX ===
At the back of the room, there’s a dusty lost-and-found box.
You dig through scarves, socks, a broken calculator, and an old lunchbox that smells strange.
At the bottom, you find a crumpled page with your handwriting on it!

Anna claps her hands.
@ANNA Nice! One clue found.
@ANNA You’re getting good at this.
~ found_pages += 1

You tuck the page into your pocket and head out.
-> HALLWAY

=== CLASSROOM_CLASSMATE ===
You lean toward a classmate drawing in his notebook.
@You Hey, have you seen a red notebook with a banana sticker?

@CLASSMATE Sure. Here it is.

Excited, you grab it and open it.
But that notebook is full of silly banana drawings, some with sunglasses, others with mustaches.

Anna nearly falls over laughing.
@ANNA It’s the Banana Gang! Case closed!

@STUDENT2 Gotcha! That’s my art project.
He chuckles as you roll your eyes.

A prank, but at least it made you smile.
-> HALLWAY

=== LIBRARY ===
You push open the library doors.
The room smells of paper and dust.

The librarian looks at you over her glasses, a finger on her lips.
@LIBRARIAN Shh! This is a quiet place.

Anna whispers:
@ANNA Detectives must work in silence… unless they find something big.
She tiptoes forward, clearly enjoying herself.

+ [Ask the librarian.] -> LIB_LIBRARIAN
+ [Search between the shelves.] -> LIB_SHELVES
+ [Check the reading tables.] -> LIB_TABLES
+ [Talk to the classmate in the corner.] -> LIB_CLASSMATE

=== LIB_LIBRARIAN ===
You walk to the desk and explain about your missing notebook.
The librarian adjusts her glasses and leans closer.

@LIBRARIAN Hmm… I saw a red notebook with a banana sticker.
@LIBRARIAN Pages were falling out everywhere.

She opens a drawer and gives you a loose sheet.
@LIBRARIAN This fell on the floor when the janitor walked by.

Anna gasps softly.
@ANNA The janitor again! He’s always around.
~ found_pages += 1

The librarian smiles slightly.
@LIBRARIAN He does move a lot. Always taping things to the notice boards.

You put the page away and nod.

+ [Leave for the cafeteria.] -> CAFETERIA

=== LIB_SHELVES ===
The shelves are tall, filled with books packed tightly together.
As you search among the books, a heavy dictionary drops to the floor.

Inside, something flutters out.
It’s a page with your handwriting.

Anna picks it up like it’s treasure.
@ANNA Detective success! The Dictionary of Secrets, now with your homework!
~ found_pages += 1

You tuck it away.
+ [Keep searching around the shelves.] -> LIB_EXPLORE
+ [Show it to the librarian.] -> LIB_LIBRARIAN

=== LIB_EXPLORE ===
You walk deeper between the shelves.
It feels very quiet.
On one shelf, an open sketchbook shows drawings of… banana stickers.

Anna leans in and whispers.
@ANNA Our suspect leaves clues everywhere.
@ANNA The janitor is like a Banana Sticker Thief.

You grin and shake your head.
+ [Check the reading tables.] -> LIB_TABLES
+ [Leave for the cafeteria.] -> CAFETERIA

=== LIB_TABLES ===
The reading tables are covered with notebooks, pens, and half-finished homework.

You look under a chair and find a crumpled page taped with a banana sticker.

Anna groans.
@ANNA He’s turning the school into a big scrapbook!
~ found_pages += 1

You fold the page and look toward the exit.
+ [Leave for the cafeteria.] -> CAFETERIA

=== LIB_CLASSMATE ===
In the far corner, a classmate pretends to read but keeps watching everyone else.

@You Hey, did you see a red notebook with a banana sticker?
@STUDENT3 Maybe. I see a lot of things.

Anna crosses her arms.
@ANNA Come on. Just tell us.

The classmate shrugs.
@STUDENT3 Fine. I saw the janitor carrying something like that.
@STUDENT3 He was going to the cafeteria.

Anna raises her eyebrows.
@ANNA The Banana Sticker Thief again.

You thank them and leave.
+ [Leave for the cafeteria.] -> CAFETERIA

=== CAFETERIA ===
The cafeteria is full of noise.
Trays clatter, students laugh, and the smell of soup mixes with warm bread.

Anna takes a deep breath.
@ANNA Detective rule number one: never work on an empty stomach.
@ANNA But fine, let’s focus!

You look around.
There are many people and many places where a notebook could be hiding.

+ [Search between the tables.] -> CAF_TABLES
+ [Peek into the kitchen.] -> CAF_COOK
+ [Check the notice board on the wall.] -> NOTICE_BOARD
+ [Talk to the group of gossiping students.] -> CAF_GOSSIP

=== CAF_TABLES ===
You move between the tables, careful not to trip over bags.
Suddenly... orange juice spills across the floor!

A student bumps into you, tray shaking.
@STUDENT1 Oh no! Sorry!

Anna laughs as she helps you up.
@ANNA Detective down! But wait, what’s that on your shoe?

You peel it off.
It’s a juice-stained page from your notebook.

@ANNA Gross but useful. Evidence found!
~ found_pages += 1

+ [Keep searching around the tables.] -> CAF_PRANK
+ [Go to the kitchen.] -> CAF_COOK

=== CAF_PRANK ===
As you dry your hands, another student waves you over.
@STUDENT1 Looking for a red notebook? I have it.

He hands you a notebook.
You open it quickly, but it’s full of banana superheroes.

Anna laughs out loud.
@ANNA First banana cartoons, now banana heroes?
@ANNA This school really loves bananas!

You sigh and hand it back.
@STUDENT1 Couldn’t resist a joke.
-> CAF_EXPLORE

=== CAF_EXPLORE ===
Anna looks around the busy room.
@ANNA Okay, detective. We found a page, we got tricked, and I’m still hungry. What now?

+ [Go to the kitchen.] -> CAF_COOK
+ [Talk to the gossiping students.] -> CAF_GOSSIP
+ [Leave for the hallway.] -> HALLWAY

=== CAF_COOK ===
You peek through the swinging doors into the kitchen.
A cook stirs a big pot of soup, steam covering his glasses.

@COOK Students again? This is a kitchen, not a playground!
* @You Sorry! We’re looking for a red notebook.
* @You Sorry, we’ll leave! -> HALLWAY
-

COOK sighs.
@COOK Red cover, banana sticker?
@COOK Yes, the janitor dropped it here earlier. Pages everywhere!

He points to the corner, where a page lies under a box.
You grab it quickly.
~ found_pages += 1

Anna waves it like a trophy.
@ANNA Case progress! We’re getting close.

COOK shakes his ladle.
@COOK Tell that janitor to keep his things out of my kitchen, or next time it goes in the soup!

You smile awkwardly and step back.
-> HALLWAY

=== CAF_GOSSIP ===
Near the wall, three students whisper together.

@STUDENT1 I heard the janitor collects stickers. He even puts them on notebooks!
@STUDENT2 Yeah, I saw him with a red one. He went toward the hallway.
@STUDENT3 Weird guy. Always talking to himself.

Anna leans close and whispers:
@ANNA Then it’s clear. The janitor’s our Banana Sticker Thief.

-> HALLWAY

=== NOTICE_BOARD ===
You stop at the cafeteria notice board.
Posters cover the wall—sports tryouts, art club, and a “Lost Sock” sign.

Anna squints.
@ANNA Wait, what’s that behind the paper?

You lift a flyer and find another notebook page, taped with a banana sticker.

@ANNA He’s leaving a trail even I can follow!
~ found_pages += 1

-> HALLWAY

=== HALLWAY ===
The hallway is full of sound—lockers closing, shoes squeaking, voices echoing.
Students hurry past in both directions.

Anna nudges you.
@ANNA Okay, detective. The janitor’s room is at the end of the hall.
@ANNA But remember, hallways hide secrets too.

You look around.

+ [Talk to the gossiping students.] -> GOSSIP
+ [Speak with a teacher passing by.] -> HALLWAY_TEACHER
+ [Check the notice board again.] -> NOTICE_BOARD2
+ [Go to the janitor’s room.] -> JANITOR_ROOM

=== GOSSIP ===
You listen to two older students by the lockers.

@STUDENT1 That janitor is strange. He collects banana stickers like treasure.
@STUDENT2 Yeah, and I saw him with a red notebook. I don’t think it was his.

They both laugh softly.
Anna whispers.
@ANNA More clues. The Banana Sticker Thief strikes again.

You grin and move on.
-> JANITOR_ROOM

=== HALLWAY_TEACHER ===
As you walk down the hall, a teacher carrying papers stops you.

@TEACHER Why aren’t you in class? The bell hasn’t rung yet, but you look busy.

@You We’re on a detective mission.
Anna jumps in.
@ANNA A very important one. A missing notebook and a sticker mystery!

The teacher raises an eyebrow.
@TEACHER Well, I did find a strange page outside the staffroom. Maybe it’s yours.

He hands you a notebook page.
~ found_pages += 1

Anna bows like she’s in a play.
@ANNA Thank you! Justice will be done!

The teacher sighs and walks away.
-> JANITOR_ROOM

=== NOTICE_BOARD2 ===
You stop by another notice board.
Posters for the school play and chess club move slightly in the breeze.

Anna points at something shiny under a flyer.
@ANNA Another sticker!

You lift the paper and find a notebook page taped beneath it.

@ANNA He’s turning the school into his own art wall.
~ found_pages += 1

-> JANITOR_ROOM

=== JANITOR_ROOM ===
You reach the janitor’s closet. The door is half open and making a small noise.
The room smells like soap and old wood.

Your red notebook is on the desk.
The banana sticker on it shines in the light that goes on and off.
Loose papers are piled up messily nearby.
Some have tape and more stickers on them.

The janitor notices you.
@JANITOR What are you kids doing here? This is no place for students.

Anna points straight at the notebook.
@ANNA That belongs to us! You’ve been caught red-handed.

The janitor frowns, leaning back in his chair.
@JANITOR Caught? I was keeping it safe. Nothing more.

+ [Accuse him directly.] -> JANITOR_DIRECT
+ [Ask politely for the notebook.] -> JANITOR_POLITE
+ [Offer a trade.] -> JANITOR_BRIBE

=== JANITOR_DIRECT ===
You cross your arms and glare.
@You You’ve been stealing notebooks, haven’t you?

The janitor slams the notebook shut and stands up.
@JANITOR Stealing? Nonsense!
@JANITOR It was falling apart—pages dropping everywhere like confetti.
@JANITOR I was only trying to protect it.

Anna narrows her eyes.
@ANNA Protect it with banana stickers?
@ANNA You turned it into a fruit salad.

The janitor sighs, shoulders slumping.
@JANITOR They’re not just stickers. They’re part of my collection.
@JANITOR I like things simple, bright, and… cheerful.
@JANITOR It helps me when the work is heavy.

Anna’s frown softens slightly, but she whispers:
@ANNA Still weird.


-> JANITOR_CONFESSION

=== JANITOR_POLITE ===
You step forward carefully.
@You Please, sir. That notebook belongs to me.
@You Could we have it back?

The janitor hesitates, tapping the cover.
@JANITOR It’s been lying around the school all day.
@JANITOR I just wanted to keep it safe.

He slowly slides it toward you.
@JANITOR But don’t mock my stickers. They matter to me.

Anna nods gently.
@ANNA We won’t laugh. But you confused the whole school.

The janitor sighs.
-> JANITOR_CONFESSION

=== JANITOR_BRIBE ===
You dig into your pocket and pull out a shiny pen.
@You What if we trade? This pen for the notebook.

The janitor chuckles, the lines on his face easing.
@JANITOR Kids these days… always bargaining.
@JANITOR Fine. Take the notebook. But the stickers stay with me.

Anna smirks.
@ANNA Detective business expense: one pen down, one notebook recovered.

-> JANITOR_CONFESSION

=== JANITOR_CONFESSION ===
The janitor rubs his forehead and sits back down heavily.

@JANITOR I wasn’t trying to steal. I only wanted to learn.
@JANITOR I practice reading the sentences in the notebook…
@JANITOR They help me understand better.
@JANITOR My job doesn’t give me time for classes, but reading… it’s something.

Anna tilts her head, suddenly softer.
@ANNA So you’re like a secret student too?

The janitor nods, embarrassed.
@JANITOR Maybe. But I shouldn’t have hidden it.
@JANITOR I just didn’t want anyone to laugh at me.

You glance at Anna, then back at him.
@You We’re not laughing. But this notebook is important.
@You I need it.

The janitor slowly pushes the stack of loose pages toward you.
@JANITOR Take them. You’ve worked hard to gather the rest.
@JANITOR You deserve it.

Anna gathers the pages with a triumphant grin.
@ANNA Detective case nearly solved! Time to count the evidence.

The janitor chuckles quietly.
@JANITOR You two are sharper than I thought.

-> ENDINGS

=== SCHOOLYARD_OPTION ===
On your way back from the janitor’s room, Anna tugs your sleeve.

@ANNA Wait, detective! Before we head to class, what if the trail continues outside?
@ANNA A true investigator checks everywhere.

You hesitate, but curiosity wins.
Together, you step into the schoolyard.

The fresh air smells of grass and chalk dust.
A soccer ball rolls past, followed by kids chasing it.

Near the fence, you spot something fluttering.

@ANNA Could it be… another page?

You rush over and peel a notebook sheet off the fence.
It’s taped with—of course—a banana sticker.

@ANNA Banana Bandit’s final clue! Case closed with style.
~ found_pages += 1

With a satisfied smile, you and Anna head back inside as the bell rings.
-> ENDINGS


=== ENDINGS ===
You hold the notebook in your hands at last, the bell echoing through the halls.

Anna leans close, eyes sparkling.
@ANNA Well, detective… how did we do?

{
- found_pages <= 1:
    You flip through the notebook. It’s nearly empty.
    @ANNA We barely found anything. At least we’re on time for class.
    @You Next time, we’ll search harder.
    @JANITOR Fast detectives, but careless ones.
    -> END
 - found_pages <= 3:
    You notice gaps where pages should be.
    @ANNA Some pieces are missing, but at least we returned most of it.
    @You Good effort for today. Maybe we’ll complete it another time.
    @JANITOR Not perfect, but good.
    -> END
- else:
    You proudly stack the recovered pages into the notebook. It’s complete.
    The janitor shakes his head in disbelief.
    @JANITOR You two are sharper than I thought. Real detectives.
    Anna grins and raises the notebook high.
    @ANNA Case closed! Detective agency officially opened!
    You both burst out laughing, earning a curious look from passing students.
    -> END
}

=== END ===
The bell rings louder, and you hurry to class with Anna at your side.
The case is over for now.
But you can’t help wondering what the next mystery will be.
-> DONE
