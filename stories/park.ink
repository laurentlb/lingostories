`A day in the Park.` #title
`It is a sunny day.`
`Anna wants to go to the park.`
`The park is always quiet and beautiful.`
`Anna puts on her shoes.`
`She walks to the park.`
$image park-1.jpg
`When Anna arrives, there are many people.`
`Many people are also walking.`
`Some people are sitting on benches and talking.`
`Where does Anna go first?`

* [Under a big tree.] -> p1
* [To the playground.] -> p2

=== p1 ===

`Anna finds a nice, big tree.`
`She sits down on the grass.`
`She takes a book and reads it.`
`She loves to read.`
`After a while, a dog comes to her.`
`The dog is friendly and wants to play.`
`What does Anna do?`

* [Play with the dog.] -> p3
* [Keep reading.] -> p4

=== p2 ===

`Anna goes to the playground.`
`Many children are playing.`
`Anna sits on a bench nearby and watches the children.`
`A little girl comes up to Anna.`
`The girl asks for help with her shoe.`
`What does Anna do?`

* [Help the little girl.] -> p5
* [Tell the girl to ask her parents.] -> p6

=== p3 ===

`Anna plays with the dog.`
`Anna throws a ball to the dog.`
$image park-3.jpg
`The dog is having fun.`
`Later, the dog's owner comes and thanks Anna.`
`What does Anna do next?`

* [Read a book.] -> p7
* [Go for a walk.] -> p8

=== p4 ===

`Anna ignores the dog and continues reading.`
`The dog finally leaves.`
`Anna enjoys her book and eats her sandwich.`
`What does Anna do next?`

* [Take a nap.] -> p9
* [Go for a walk.] -> p8

=== p5 ===

`Anna helps the little girl with her shoe.`
`The girl smiles and thanks Anna.`
`The girl's parents come over and thank Anna as well.`
`The parents offer Anna some cookies.`

-> p10

=== p6 ===

`Anna tells the girl to ask her parents.`
`The girl runs back to her parents.`
`Anna stays on the bench.`
`After a while, she decides to do something else.`

* [Sit under a big tree.] -> p1
* [Go for a walk.] -> p8

=== p7 ===

`Anna sits down to read her book.`
`She reads for a while.`
`She feels very relaxed.`
`The park is very peaceful.`

* [Take a nap.] -> p9
* [Go for a walk.] -> p8

=== p8 ===

`Anna decides to go for a walk in the park.`
`Anna looks at some beautiful flowers.`
`She listens to the birds singing.`
`She feels happy.`
`Then she sees her friend Tom.`
`Tom is also walking in the park.`

-> p15

=== p9 ===

`Anna takes a nap under the tree.`
`She dreams that she flies like a bird.`
$image park-5.jpg
`She wakes up feeling relaxed and happy.`

* [Go for a walk.] -> p8

=== p10 ===

`The cookies are very tasty.`
`Anna feels happy and decides to do something else.`

* [Play with the girl.] -> p14
* [Go for a walk.] -> p8

=== p14 ===

`Anna and the girl play a game.`
$image park-4.jpg
`They play tag and have a lot of fun.`
`After a while, the girl has to go.`
`Anna says goodbye.`

* [Go for a walk.] -> p8

=== p15 ===

`Anna smiles and waves to Tom.`
$image park-2.jpg
`Tom waves back and walks over to her.`
@tom Hi Anna, it's great to see you here!

* [What a nice surprise!] -> p16
* [Do you come here often?] -> p17

=== p16 ===

@anna Hi Tom, what a nice surprise!

-> p31

=== p17 ===

`@anna Hi Tom, do you come here often?`

-> p31

=== p18 ===

`@anna I like to come here to read and enjoy the fresh air.`
`@tom That sounds nice. What book are you reading?`

* [A detective story.] -> p20
* [An adventure novel.] -> p21

=== p19 ===

`@anna I like to watch the people.`
`@tom Me too! It's fun to see everyone having a good time.`
`@tom I also like watching the animals.`

* [Do you have a favorite animal here?] -> p22
* [Do you like playing with the dogs here?] -> p23

=== p20 ===

`@anna It's a detective story.`
`@tom Detective stories are great, they are full of surprises.`

-> p25

=== p21 ===

`@anna It's an adventure novel.`
`@tom Adventure novels are so exciting! They take you to new places.`
`undefined`

-> p25

=== p22 ===

`@anna Do you have a favorite animal here?`
`@tom I really like the squirrels. They're so cute!`

* [I like the squirrels too!] -> p28
* [I like the birds more.] -> p28

=== p23 ===

`@anna Do you like playing with the dogs here?`
`@tom Yes, I love dogs. Dogs always look so happy.`

* [I played with a dog earlier today.] -> p28
* [I like watching them play too.] -> p28

=== p25 ===

`@anna What other kinds of books do you like?`
`@tom I also read science fiction books.`
`@tom Science fiction books make you think about the future.`

* [Maybe we can read one together sometime?] -> p28
* [We should talk about our favorite books more often.] -> p28

=== p28 ===

`Anna and Tom continue to talk and laugh for a while.`
`It's getting dark and it's time to go home.`
`Anna says goodbye to Tom and goes home.`
`It was a good day.`
-> END

=== p31 ===

`Tom smiles.`
`@tom Yes, I come here sometimes to relax. What about you?`

* [I like to read here.] -> p18
* [I like to watch the people here.] -> p19
