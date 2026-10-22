Lost & Found #title

VAR found_pages = 0

-> START

=== START ===
You arrive at school, balancing your backpack on your shoulder.
The morning bell will ring soon.

You reach into your bag.
Then you stop.
Your red notebook with a banana sticker on the cover is gone!

This is not just any notebook.
It has your homework, your class notes, and even a few doodles.
The teacher asked everyone to bring homework today.
Your homework is in that notebook.

Anna, your best friend, sees your wide eyes.
@anna Whoa! What happened? You look like you saw a ghost.

@you My notebook. It is gone. All my homework is in there!

Anna gasps, then raises one eyebrow.
@anna Do not panic, detective. Every mystery begins with something missing.

She puts her hand on her chin and walks in a small circle.

@anna Step one: look at the scene.
@anna Step two: ask questions.
@anna Step three: follow the clues.

Even though you are nervous, you smile. Anna always makes things funny.

@anna Let us solve this together. Where should we start?

+ [Go to the library.] -> LIBRARY
+ [Go to the hallway.] -> HALLWAY
+ [Search around the classroom.] -> CLASSROOM_SEARCH

=== CLASSROOM_SEARCH ===
You look around the classroom before leaving.
The teacher hasn’t arrived yet.
The students are talking, throwing paper airplanes, and sneaking snacks.

@anna Good idea, detective. Always start where it happened.

+ [Peek inside the teacher’s desk.] -> TEACHER_DESK
+ [Check the classroom lost-and-found box.] -> LOST_FOUND_BOX
+ [Ask a classmate nearby.] -> CLASSROOM_CLASSMATE

=== TEACHER_DESK ===
You pull gently on the teacher’s desk drawer.
It squeaks open.
Papers, chalk, and… a notebook!

Your heart jumps, until you see it’s orange, not red.

Anna laughs.
@anna Detective note: wrong color.
@anna Close, but not the one.

You sigh and slide the orange notebook back. At least you tried.
-> HALLWAY

=== LOST_FOUND_BOX ===
At the back of the room, there’s a dusty lost-and-found box.
You dig through scarves, socks, a broken calculator, and an old lunchbox that smells strange.
At the bottom, you find a crumpled page with your handwriting on it!

Anna claps her hands.
@anna Nice! One clue found.
@anna You are getting good at this.
~ found_pages += 1
$image lost-classroom-page.jpg

You tuck the page into your pocket and head out.
-> HALLWAY

=== CLASSROOM_CLASSMATE ===
You lean toward a classmate drawing in his notebook.
@you Hey, have you seen a red notebook with a banana sticker?

@student2 Sure. Here it is.

Excited, you grab it and open it.
But that notebook is full of silly banana drawings, some with sunglasses, others with mustaches.

Anna nearly falls over laughing.
@anna It is the Banana Gang! Case closed!

@student2 Gotcha! That is my art project.
He laughs as you roll your eyes.

A prank, but at least it makes you smile.
-> HALLWAY

=== LIBRARY ===
You push open the library doors.
The room smells of paper and dust.

The librarian looks at you over her glasses and puts a finger on her lips.
@librarian Shh! This is a quiet place.

Anna whispers:
@anna Detectives must work in silence... unless they find something big.
She tiptoes forward, clearly enjoying herself.

+ [Ask the librarian.] -> LIB_LIBRARIAN
+ [Search between the shelves.] -> LIB_SHELVES
+ [Check the reading tables.] -> LIB_TABLES
+ [Talk to the classmate in the corner.] -> LIB_CLASSMATE

=== LIB_LIBRARIAN ===
You walk to the desk and explain about your missing notebook.
The librarian adjusts her glasses and leans closer.

@librarian Hmm... I saw a red notebook with a banana sticker.
@librarian Pages were falling out everywhere.

She opens a drawer and gives you a loose sheet.
@librarian This fell on the floor when the janitor walked by.

Anna gasps softly.
@anna The janitor again! He is always around.
~ found_pages += 1
$image lost-library-page.jpg

The librarian smiles a little.
@librarian He moves all around the school. He is always taping things to the notice boards.

You put the page away and nod.

+ [Leave for the cafeteria.] -> CAFETERIA

=== LIB_SHELVES ===
The shelves are tall, filled with books packed tightly together.
As you search among the books, a heavy dictionary drops to the floor.

Inside, something flutters out.
It’s a page with your handwriting.

Anna picks it up like treasure.
@anna Detective success! The Dictionary of Secrets now has your homework!
~ found_pages += 1

You tuck it away.
+ [Keep searching around the shelves.] -> LIB_EXPLORE
+ [Show it to the librarian.] -> LIB_LIBRARIAN

=== LIB_EXPLORE ===
You walk deeper between the shelves.
It feels very quiet.
On one shelf, an open sketchbook shows drawings of… banana stickers.

Anna leans in and whispers.
@anna Our suspect leaves clues everywhere.
@anna The janitor is like a Banana Sticker Thief.

You grin and shake your head.
+ [Check the reading tables.] -> LIB_TABLES
+ [Leave for the cafeteria.] -> CAFETERIA

=== LIB_TABLES ===
The reading tables are covered with notebooks, pens, and half-finished homework.

You look under a chair and find a crumpled page taped with a banana sticker.

Anna groans.
@anna He is turning the school into a big scrapbook!
~ found_pages += 1

You fold the page and look toward the exit.
+ [Leave for the cafeteria.] -> CAFETERIA

=== LIB_CLASSMATE ===
In the far corner, a classmate pretends to read but keeps watching everyone else.

@you Hey, did you see a red notebook with a banana sticker?
@student3 Maybe. I see a lot of things.

Anna crosses her arms.
@anna Come on. Just tell us.

The classmate shrugs.
@student3 Fine. I saw the janitor carrying something like that.
@student3 He was going to the cafeteria.

Anna raises her eyebrows.
@anna The Banana Sticker Thief again.

You thank them and leave.
+ [Leave for the cafeteria.] -> CAFETERIA

=== CAFETERIA ===
The cafeteria is full of noise.
Trays clatter, students laugh, and the smell of soup mixes with warm bread.

Anna takes a deep breath.
@anna Detective rule number one: never work on an empty stomach.
@anna But fine, let us focus!

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
@student1 Oh no! Sorry!

Anna laughs as she helps you up.
@anna Detective down! But wait, what is that on your shoe?

You peel it off.
It’s a juice-stained page from your notebook.

@anna Gross but useful. Evidence found!
~ found_pages += 1
$image lost-cafeteria-page.jpg

+ [Keep searching around the tables.] -> CAF_PRANK
+ [Go to the kitchen.] -> CAF_COOK

=== CAF_PRANK ===
As you dry your hands, another student waves you over.
@student1 Looking for a red notebook? I have it.

He hands you a notebook.
You open it quickly, but it’s full of banana superheroes.

Anna laughs out loud.
@anna First banana cartoons, now banana heroes?
@anna This school really loves bananas!

You sigh and hand it back.
@STUDENT1 Couldn’t resist a joke.
-> CAF_EXPLORE

=== CAF_EXPLORE ===
Anna looks around the busy room.
@anna Okay, detective. We found a page, we got tricked, and I am still hungry. What now?

+ [Go to the kitchen.] -> CAF_COOK
+ [Talk to the gossiping students.] -> CAF_GOSSIP
+ [Leave for the hallway.] -> HALLWAY

=== CAF_COOK ===
You peek through the swinging doors into the kitchen.
A cook stirs a big pot of soup, steam covering his glasses.

@cook Students again? This is a kitchen, not a playground!
* @you Sorry! We are looking for a red notebook.
* @you Sorry, we will leave! -> HALLWAY
-

The cook sighs.
@cook Red cover, banana sticker?
@cook Yes, the janitor dropped it here earlier. Pages everywhere!

He points to the corner, where a page lies under a box.
You grab it quickly.
~ found_pages += 1

Anna waves it like a trophy.
@anna Case progress! We are getting close.

The cook shakes his ladle.
@cook Tell that janitor to keep his things out of my kitchen, or next time it goes in the soup!

You smile awkwardly and step back.
-> HALLWAY

=== CAF_GOSSIP ===
Near the wall, three students whisper together.

@student1 I heard the janitor collects stickers. He even puts them on notebooks!
@student2 Yes, I saw him with a red one. He went toward the hallway.
@student3 Weird guy. He is always talking to himself.

Anna leans close and whispers:
@anna Then it is clear. The janitor is our Banana Sticker Thief.

-> HALLWAY

=== NOTICE_BOARD ===
You stop at the cafeteria notice board.
Posters cover the wall—sports tryouts, art club, and a “Lost Sock” sign.

Anna squints.
@anna Wait, what is that behind the paper?

You lift a flyer and find another notebook page, taped with a banana sticker.

@anna He is leaving a trail even I can follow!
~ found_pages += 1

-> HALLWAY

=== HALLWAY ===
The hallway is full of sound—lockers closing, shoes squeaking, voices echoing.
Students hurry past in both directions.

Anna nudges you.
@anna Okay, detective. The janitor’s room is at the end of the hall.
@anna But remember, hallways hide secrets too.

You look around.

+ [Talk to the gossiping students.] -> GOSSIP
+ [Speak with a teacher passing by.] -> HALLWAY_TEACHER
+ [Check the notice board again.] -> NOTICE_BOARD2
+ [Go to the janitor’s room.] -> JANITOR_ROOM

=== GOSSIP ===
You listen to two older students by the lockers.

@student1 That janitor is strange. He collects banana stickers like treasure.
@student2 Yes, and I saw him with a red notebook. I do not think it was his.

They both laugh softly.
Anna whispers.
@anna More clues. The Banana Sticker Thief strikes again.

You grin and move on.
-> JANITOR_ROOM

=== HALLWAY_TEACHER ===
As you walk down the hall, a teacher carrying papers stops you.

@teacher Why are you not in class? The bell has not rung yet, but you look busy.

@you We are on a detective mission.
Anna jumps in.
@anna A very important one. A missing notebook and a sticker mystery!

The teacher raises an eyebrow.
@teacher Well, I did find a strange page outside the staffroom. Maybe it is yours.

He hands you a notebook page.
~ found_pages += 1

Anna bows like she is in a play.
@anna Thank you! Justice will be done!

The teacher sighs and walks away.
-> JANITOR_ROOM

=== NOTICE_BOARD2 ===
You stop by another notice board.
Posters for the school play and chess club move slightly in the breeze.

Anna points at something shiny under a flyer.
@anna Another sticker!

You lift the paper and find a notebook page taped beneath it.

@anna He is turning the school into his own art wall.
~ found_pages += 1

-> JANITOR_ROOM

=== JANITOR_ROOM ===
You reach the janitor’s closet. The door is half open and making a small noise.
The room smells like soap and old wood.

Your red notebook is on the desk.
The banana sticker on it shines under a blinking light.
Loose papers are piled up messily nearby.
Some have tape and more stickers on them.

The janitor notices you.
@janitor What are you kids doing here? This is no place for students.

Anna points straight at the notebook.
@anna That notebook is ours! Why do you have it?

The janitor frowns, leaning back in his chair.
@JANITOR Caught? I was keeping it safe. Nothing more.

+ [Accuse him directly.] -> JANITOR_DIRECT
+ [Ask politely for the notebook.] -> JANITOR_POLITE
+ [Offer a trade.] -> JANITOR_BRIBE

=== JANITOR_DIRECT ===
You cross your arms and glare.
@you You took the notebook, did you not?

The janitor closes the notebook and stands up.
@janitor Stealing? No.
@janitor It was falling apart.
@janitor Pages were dropping everywhere.
@janitor I was only trying to protect it.

Anna narrows her eyes.
@anna Protect it with banana stickers?
@anna You turned it into a banana book.

The janitor sighs, shoulders slumping.
@janitor They are not just stickers. They are part of my collection.
@janitor I like things simple, bright, and cheerful.
@janitor They help me when the work is heavy.

Anna's frown softens a little, but she whispers:
@anna Still weird.


-> JANITOR_CONFESSION

=== JANITOR_POLITE ===
You step forward carefully.
@you Please, sir. That notebook belongs to me.
@you Could we have it back?

The janitor hesitates, tapping the cover.
@janitor It has been lying around the school all day.
@janitor I just wanted to keep it safe.

He slowly slides it toward you.
@janitor But do not mock my stickers. They matter to me.

Anna nods gently.
@anna We will not laugh. But you confused the whole school.

The janitor sighs.
-> JANITOR_CONFESSION

=== JANITOR_BRIBE ===
You dig into your pocket and pull out a shiny pen.
@you What if we trade? This pen for the notebook.

The janitor chuckles, the lines on his face easing.
@janitor Kids these days... always bargaining.
@janitor Fine. Take the notebook. But the stickers stay with me.

Anna smirks.
@anna Detective business expense: one pen down, one notebook recovered.

-> JANITOR_CONFESSION

=== JANITOR_CONFESSION ===
The janitor rubs his forehead and sits back down.

@janitor I was not trying to steal it. I only wanted to learn.
@janitor I practice reading the sentences in the notebook.
@janitor They help me understand better.
@janitor My job does not give me time for classes.
@janitor But reading a little helps.

Anna tilts her head, suddenly softer.
@anna So you are like a secret student too?

The janitor nods, embarrassed.
@janitor Maybe.
@janitor But I should not have hidden it.
@janitor I just did not want anyone to laugh at me.
@janitor And I do not have every page.
@janitor Some pages fell in other places before I could pick them up.

You glance at Anna, then back at him.
@you We are not laughing. But this notebook is important.
@you I need it.

The janitor slowly pushes the stack of loose pages toward you.
@janitor Take them. You worked hard to gather the rest.
@janitor You deserve it.

Anna gathers the pages with a triumphant grin.
@anna Detective case nearly solved! Time to count the evidence.

The janitor chuckles quietly.
@janitor You two are sharper than I thought.

* [Go back to class.] -> ENDINGS
* {found_pages < 4} [Check the schoolyard first.] -> SCHOOLYARD_OPTION

=== SCHOOLYARD_OPTION ===
On your way back from the janitor’s room, Anna tugs your sleeve.

@anna Wait, detective! Before we head to class, what if the trail continues outside?
@anna A true investigator checks everywhere.

You hesitate, but curiosity wins.
Together, you step into the schoolyard.

The fresh air smells of grass and chalk dust.
A soccer ball rolls past, followed by kids chasing it.

Near the fence, you spot something fluttering.

@anna Could it be... another page?

You rush over and peel a notebook sheet off the fence.
It is taped with, of course, a banana sticker.

@anna Banana Bandit's final clue! Case closed with style.
~ found_pages += 1

With a satisfied smile, you and Anna head back inside as the bell rings.
-> ENDINGS


=== ENDINGS ===
You hold the notebook in your hands at last, the bell echoing through the halls.

Anna leans close, eyes sparkling.
@anna Well, detective... how did we do?

{
- found_pages <= 1:
    You flip through the notebook. It’s nearly empty.
    @anna We barely found anything. At least we are on time for class.
    @you Next time, we will search harder.
    @janitor Fast detectives, but careless ones.
    -> END
 - found_pages <= 3:
    You notice gaps where pages should be.
    @anna Some pieces are missing, but at least we returned most of it.
    @you Good effort for today. Maybe we will complete it another time.
    @janitor Not perfect, but good.
    -> END
- else:
    You proudly stack the recovered pages into the notebook. It’s complete.
    The janitor shakes his head in disbelief.
    @janitor You two are sharper than I thought. Real detectives.
    Anna grins and raises the notebook high.
    @anna Case closed! Detective agency officially opened!
    You both burst out laughing, earning a curious look from passing students.
    $image lost-good-ending.jpg
    -> END
}

=== END ===
The bell rings louder, and you hurry to class with Anna at your side.
The case is over for now.
But you can’t help wondering what the next mystery will be.
-> DONE
