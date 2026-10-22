Lost & Found #title

VAR found_pages = 0
VAR janitor_clue = false

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
@anna Stay calm, detective. Every mystery begins with something missing.

She puts her hand on her chin and walks in a small circle.

@anna Step one: look at the scene.
@anna Step two: ask questions.
@anna Step three: follow the clues.

Even though you are nervous, you smile. Anna always makes things funny.

@anna We can solve this together. Where should we start?

+ [Go to the library.] -> LIBRARY
+ [Go to the hallway.] -> HALLWAY
+ [Search around the classroom.] -> CLASSROOM_SEARCH

=== CLASSROOM_SEARCH ===
You look around the classroom before leaving.
The teacher has not arrived yet.
The students are talking, throwing paper airplanes, and sneaking snacks.

@anna Good idea, detective. Always start where it happened.

+ [Peek inside the teacher's desk.] -> TEACHER_DESK
+ [Check the classroom lost-and-found box.] -> LOST_FOUND_BOX
+ [Ask a classmate nearby.] -> CLASSROOM_CLASSMATE

=== TEACHER_DESK ===
You pull gently on the teacher's desk drawer.
It squeaks open.
Papers, chalk, and... a notebook!

Your heart jumps, until you see it is orange, not red.

Anna laughs.
@anna Detective note: wrong color.
@anna Close, but not the one.

You sigh and slide the orange notebook back. At least you tried.
-> HALLWAY

=== LOST_FOUND_BOX ===
At the back of the room, there is a dusty lost-and-found box.
You dig through scarves, socks, a broken calculator, and an old lunchbox that smells strange.
At the bottom, you find a crumpled page with your handwriting on it!

Anna claps her hands.
@anna Nice! One clue found.
@anna You are getting good at this.
~ found_pages += 1
$collect lost-classroom-page.jpg

You put the page in your pocket and head out.
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

Anna whispers.
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
@anna The janitor! He is everywhere.
~ found_pages += 1
~ janitor_clue = true
$collect lost-library-page.jpg

The librarian smiles a little.
@librarian He moves all around the school. He is always taping things to the notice boards.

You put the page away and nod.
-> LIBRARY_EXIT

=== LIB_SHELVES ===
The shelves are tall, filled with books packed tightly together.
As you search among the books, a heavy dictionary drops to the floor.

Inside, something flutters out.
It is a page with your handwriting.

Anna picks it up like treasure.
@anna Detective success! Even the dictionary was hiding your homework!
~ found_pages += 1

You put it away.
+ [Keep searching around the shelves.] -> LIB_EXPLORE
+ [Show it to the librarian.] -> LIB_LIBRARIAN

=== LIB_EXPLORE ===
You walk deeper between the shelves.
It feels very quiet.
On one shelf, there is a big book called "The World of Fruit Stickers".
A note inside says: "Please return to the janitor."

Anna leans in and whispers.
@anna The janitor collects stickers? And your notebook has a banana sticker...
@anna Our suspect is the Banana Sticker Thief!
~ janitor_clue = true

You grin and shake your head.
+ [Check the reading tables.] -> LIB_TABLES
+ [Leave the library.] -> LIBRARY_EXIT

=== LIB_TABLES ===
The reading tables are covered with notebooks, pens, and half-finished homework.

You look under a chair and find a crumpled page from your notebook.

Anna groans.
@anna Your pages are all over the school!
~ found_pages += 1

You fold the page and look toward the exit.
-> LIBRARY_EXIT

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
@anna The janitor! Interesting...
~ janitor_clue = true

You thank them and leave.
-> LIBRARY_EXIT

=== LIBRARY_EXIT ===
+ {not CAFETERIA} [Leave for the cafeteria.] -> CAFETERIA
+ [Go back to the hallway.] -> HALLWAY

=== CAFETERIA ===
The cafeteria is full of noise.
Trays clatter, students laugh, and the smell of soup mixes with warm bread.

Anna takes a deep breath.
@anna Detective rule number one: never work on an empty stomach.
@anna But fine, we can eat later!

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
It is a juice-stained page from your notebook.

@anna Gross but useful. Evidence found!
~ found_pages += 1
$collect lost-cafeteria-page.jpg

+ [Keep searching around the tables.] -> CAF_PRANK
+ [Go to the kitchen.] -> CAF_COOK

=== CAF_PRANK ===
As you clean your shoe, another student waves you over.
@student2 Looking for a red notebook? I have it.

He hands you a notebook.
You open it quickly, but it is full of banana superheroes.

Anna laughs out loud.
@anna Banana superheroes?
@anna This school really loves bananas!

You sigh and hand it back.
@student2 Sorry, I could not resist a joke.
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
* @you Sorry, we will leave!
    -> HALLWAY
-

The cook sighs.
@cook Red cover, banana sticker?
@cook Yes, the janitor dropped it here earlier. Pages everywhere!
~ janitor_clue = true

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
@student3 Weird guy. He is always reading to himself.

Anna leans close and whispers.
@anna Then it is clear. The janitor is our Banana Sticker Thief.
~ janitor_clue = true

-> HALLWAY

=== NOTICE_BOARD ===
You stop at the cafeteria notice board.
Posters cover the wall: sports tryouts, art club, and a "Lost Sock" sign.

Anna squints.
@anna Wait, what is that behind the paper?

You lift a flyer and find another notebook page.
There is a note on it: "Found in the cafeteria. The janitor."

@anna The janitor puts everything he finds on the notice boards!
~ found_pages += 1
~ janitor_clue = true

-> HALLWAY

=== HALLWAY ===
{
- HALLWAY == 1:
    The hallway is full of sound: lockers closing, shoes squeaking, voices echoing.
    Students hurry past in both directions.
    Anna nudges you.
    @anna Remember, detective, hallways hide secrets too.
- else:
    You are back in the hallway.
}
{janitor_clue:
    @anna The janitor's room is at the end of the hall.
}
@anna Where do we go now?

* [Talk to the gossiping students.] -> GOSSIP
* [Speak with a teacher passing by.] -> HALLWAY_TEACHER
* [Check the notice board.] -> NOTICE_BOARD2
+ {not LIBRARY} [Go to the library.] -> LIBRARY
+ {not CAFETERIA} [Go to the cafeteria.] -> CAFETERIA
+ {janitor_clue} [Go to the janitor's room.] -> JANITOR_ROOM

=== GOSSIP ===
You listen to two older students by the lockers.

@student1 That janitor is strange. He collects banana stickers like treasure.
@student2 Yes, and I saw him with a red notebook. I do not think it was his.

They both laugh softly.
Anna whispers.
@anna More clues. The Banana Sticker Thief strikes again.
~ janitor_clue = true

You grin and move on.
-> HALLWAY

=== HALLWAY_TEACHER ===
As you walk down the hall, a teacher carrying papers stops you.

@teacher Where are you two going in such a hurry?

@you We are on a detective mission.
Anna jumps in.
@anna A very important one. A missing notebook and a sticker mystery!

The teacher raises an eyebrow.
@teacher Well, the janitor gave me this page this morning. Maybe it is yours.

He hands you a notebook page.
~ found_pages += 1
~ janitor_clue = true

Anna bows like she is in a play.
@anna Thank you! Justice will be done!

The teacher sighs and walks away.
-> HALLWAY

=== NOTICE_BOARD2 ===
You stop by the hallway notice board.
Posters for the school play and chess club move slightly in the breeze.

Anna points at a page under a flyer.
@anna Look! Is that yours?

You lift the flyer. It is a page from your notebook.
There is a note on it: "Found in the hallway. The janitor."

@anna The janitor puts everything he finds on the notice boards!
~ found_pages += 1
~ janitor_clue = true

-> HALLWAY

=== JANITOR_ROOM ===
You reach the janitor's room. The door is half open.
The room smells like soap and old wood.
The wall is covered with fruit stickers.

Your red notebook is on the desk.
The banana sticker on it shines under a blinking light.
Loose papers are piled up nearby.

The janitor notices you.
@janitor What are you kids doing here? This is no place for students.

Anna points straight at the notebook.
@anna That notebook is ours! Why do you have it?

The janitor frowns, leaning back in his chair.
@janitor Calm down. I was keeping it safe. That is all.

+ [Accuse him directly.] -> JANITOR_DIRECT
+ [Ask politely for the notebook.] -> JANITOR_POLITE
+ [Offer a trade.] -> JANITOR_BRIBE

=== JANITOR_DIRECT ===
You cross your arms and glare.
@you You took my notebook!

The janitor closes the notebook and stands up.
@janitor Took it? No.
@janitor It was falling apart.
@janitor Pages were dropping everywhere.
@janitor I was only trying to protect it.

Anna narrows her eyes.
@anna And what about all these stickers?

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
@janitor But do not laugh at my stickers. They matter to me.

Anna nods gently.
@anna We will not laugh. But we searched the whole school for it!

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

@janitor I was not trying to steal it.
@janitor I found it this morning, and I wanted to read it a little.
@janitor I practice my reading with the sentences in your notebook.
@janitor My job does not give me time for classes.
@janitor But reading a little helps.

Anna tilts her head, suddenly softer.
@anna So you are like a secret student too?

The janitor nods, embarrassed.
@janitor Maybe.
@janitor But I should not have kept it.
@janitor I just did not want anyone to laugh at me.
@janitor And I do not have every page.
@janitor Some pages fell out in other places before I found the notebook.

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
On your way back from the janitor's room, Anna pulls your sleeve.

@anna Wait, detective! Before we go to class, what if the trail continues outside?
@anna A true investigator checks everywhere.

You hesitate, but curiosity wins.
Together, you step into the schoolyard.

The fresh air smells of grass and chalk dust.
A soccer ball rolls past, followed by kids chasing it.

Near the fence, you spot something moving in the wind.

@anna Could it be... another page?

You rush over and pull a notebook page off the fence.
The wind carried it all the way out here!

@anna The final clue! Case closed with style.
~ found_pages += 1

With a satisfied smile, you and Anna head back inside as the bell rings.
-> ENDINGS

=== ENDINGS ===
You finally have your notebook. The bell rings through the halls.

Anna leans close, eyes sparkling.
@anna Well, detective... how did we do?

{
- found_pages <= 1:
    You flip through the notebook. Many pages are still missing.
    Your homework is not there.
    @anna Oh no! Well, at least we are on time for class.
    @you Next time, I will keep my notebook in my bag!
- found_pages <= 3:
    You notice gaps where pages should be.
    @anna Some pages are still missing, but your homework is there.
    @you Good work for today. Maybe we can find the rest tomorrow.
- else:
    You put all the pages back into the notebook. It is complete!
    Anna grins and raises the notebook high.
    @anna Case closed! Detective agency officially open!
    You both burst out laughing, earning a curious look from passing students.
    $collect lost-good-ending.jpg
}
-> EPILOGUE

=== EPILOGUE ===
You hurry to class with Anna at your side.
The case is over for now.
But you cannot help wondering what the next mystery will be.
-> END
