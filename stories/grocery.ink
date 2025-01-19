LIST items = apples, pears, tomatoes, carrots, chocolate, eggs, bread, pastry
VAR inventory = ()
VAR money = 0
VAR teacher = false
VAR treats = 0

// Costs:
// Pears (5), Tomatoes (3), eggs(4), bread(3)

-> introduction

=== function buy(item, cost) ===
{money >= cost :
  ~ money -= cost
  ~ inventory += item
  $audio coins
  ~ return true
- else:
  It looks like you don't have enough money.
  ~ return false
}


=== introduction ===

The Grocery List #title
It is Saturday afternoon.
You are new to the village because your family has just moved here.
It is a bit cold outside today.
So you are playing with your toys in your bedroom.
$image grocery-bedroom.jpg
Your mom calls you.

- (loop1)
{&@mom Peter!|@mom Peter, please come here.}
* [Leave the bedroom] -> downstairs
* (looped) [Keep playing]
  You play for a few more minutes.
  -> loop1
* {looped} [Keep playing]
  You want to play more, but your mom really insists.
  -> downstairs

= downstairs

@peter Yes, mom. I'm coming.
You leave the bedroom and go to your mom.

@mom Can you please go shopping for dinner?
@mom Grandma is visiting us tonight, so we need five apples to make her favorite apple pie.
@mom We also need three tomatoes and four eggs for the dinner.
@mom You'll find everything at the supermarket.
~ money += 17
@mom Here are 17 coins, I think that should be enough.
@mom Oh, and we need bread too!

- (loop2)
* @peter Can I stay home?
    @peter I'd love to play more.
    @mom No, it's important to have food for dinner. You can play later.
* @peter How do I get to the supermarket?
    @mom You'll find it at the end of the street, just turn right.
    @mom It's on the main square.
    @mom Remember, we went there last week.
* @peter Can you repeat the shopping list?
    @mom Sure. We need three tomatoes, four eggs, five apples, and bread.
* @peter Can I buy something for myself?
    @peter I'd like to get some chocolate or maybe a pastry.
    @mom If you have enough coins, you can buy something for yourself.
    @mom But first, please buy the food for dinner.
* [Leave]
    @peter Alright, I'm going now.
    -> travel
- -> loop2

=== travel ===

You leave the house.
$image grocery-house.jpg
It is sunny with a bit of wind.
It's not that cold.
You see children playing in the park as you pass by.
You walk down the street until the end.
@peter Which way is it? I think I should turn left now.
* [Go left]
    You take the street on the left.
    -> lost
* [Go right]
    You take the street on the right.
    -> main_square

=== lost ===

{&After a few minutes, you find another crossroad.|You feel lost and see another crossroad.|Another crossroad? Where should you go?}
{&@peter Is it the street on the right? I'm not sure.|}

+ [Go left]
    You take the street on the left.
    -> lost
+ [Go right]
    You take the street on the right.
    -> lost
+ [Go straight]
    You continue straight ahead.
    -> lost
+ [Go back]
    You are afraid of getting lost.
    You decide to go back.
    But after a while, it starts to feel familiar.
    -> main_square

=== main_square ===
{!You reach the main square.|A street musician is playing guitar on the main square.|There are many people on the main square.|On the main square, a group of tourists is taking photos of the old buildings.}
{!\$image grocery-square.jpg}
{The supermarket is right in front of you.|}

+ [Go to the supermarket]
    -> supermarket
+ [Go to the bakery]
    -> bakery
+ [Go to the outdoor market]
    -> market
+ {teacher && not (inventory ? apples)} [Look for your music teacher]
    -> music_teacher
+ {inventory ? chocolate} [Eat chocolate]
    $audio eat
    The chocolate tastes delicious.
    ~ inventory -= chocolate
    -> main_square
+ {inventory ? pastry} [Eat the pastry]
    $audio eat
    The pastry is really good.
    ~ inventory -= pastry
    -> main_square
+ {money < 16 && money > 1} [Go back home]
    @peter I still have some coins to spend.
    ** [Go back home] -> home
    ++ [Stay] -> main_square
+ {money <= 1} [Go back home]
    -> home

=== supermarket ===

{You enter the supermarket.|}
{It's hard to find what you want.|}
{An employee asks if you need help.|}

- (loop)
{@employee What are you looking for?|@employee Anything else?}
* [Tomatoes]
    @peter I'd like some tomatoes.
    @employee Sorry, we're out of tomatoes.
    @employee But they should have tomatoes on the market.
* [Apples]
    @peter Do you have apples?
    @employee I don't know why everyone wants apples today.
    @employee Unfortunately, we don't have any more.
+ {not (inventory ? eggs)} [Eggs]
    @peter I need eggs.
    @employee How many eggs do you want?
    ** [4 eggs (4🪙)]
        @peter Four.
        ~ buy(eggs, 4)
    ** [6 eggs (6🪙)]
        @peter Six.
        ~ buy(eggs, 6)
    ** [12 eggs (9🪙)]
        @peter Twelve.
        ~ buy(eggs, 9)
* [Bread]
    @peter I am looking for the bread.
    @employee Unfortunately, we don't have bread anymore today.
    @employee But there's a bakery nearby.
* [Wine]
    @peter Can I have a bottle of wine?
    @employee How old are you?
    ** [10 years old]
        @peter I am 10 years old.
    ** [Lie]
        @peter I am... 11 years old!
    -- @employee Sorry, you're too young to buy wine.
* [Chocolate (2🪙)]
    @peter I'll buy my favorite chocolate.
    {buy(chocolate, 2):
        ~ treats += 1
    }

+ [Leave]
    @peter That's all, thank you.
    You leave the supermarket.
   -> main_square

- -> loop

=== bakery ===

You enter the bakery.
{It smells like fresh bread|}
{You see your favorite pastry.|}
{You recognize the baker.|}
{He smiles at you.|}

@baker Hello Peter, what would you like today?

- (loop)

* {not apples} [Apples]
    @peter Do you have apples?
    Sorry, this is a bakery, we don't sell apples.
* {not (inventory ? pastry)} [Pastry (2🪙)]
    @peter This pastry, please.
    {buy(pastry, 2):
        ~ treats += 1
    }
* {not (inventory ? pastry)} [Bigger pastry (4🪙)]
    @peter This pastry, please.
    {buy(pastry, 4):
        ~ treats += 1
    }
* [Bread (3🪙)]
    @peter I would like this bread, please.
    ~ buy(bread, 3)
+ [Leave]
    @baker See you soon, Peter!
    -> main_square
- -> loop

=== market ===

{-> music_teacher_first|}

{You approach the man who sells fruits and vegetables.|}

{@seller Hello! What would you like?|@seller Do you want something else?}

- (loop)
* [Apples]
    @peter I'd like some apples.
    @seller Sorry, we just sold the last apples to that woman.
    @peter Ms. Melody?
    @peter Oh no, I have to find a solution!
    @seller Maybe you can use pears instead?
    ~ teacher = true
* [Pears (5🪙)]
    @peter Can I get the pears, please?
    ~ buy(pears, 5)
+ {not (inventory ? tomatoes)} [Tomatoes]
    @seller How many tomatoes do you want?
    ++ [3]
        @peter Three tomatoes, please.
        ~ buy(tomatoes, 3)
    ++ [4]
        @peter Four tomatoes, please.
        ~ buy(tomatoes, 4)
    ++ [5]
        @peter Five tomatoes, please.
        ~ buy(tomatoes, 5)
    -- {inventory ? tomatoes:
          Peter puts the tomatoes in his bag.
        }
* [Carrots (2🪙)]
    @peter I'll take two carrots.
    ~ buy(carrots, 2)
+ [Leave]
    @seller See you soon!
    -> main_square

- -> loop

=== music_teacher_first ===

You decide to go to the market.
$image grocery-market.jpg
When you arrive near the fruits and vegetables, you recognize someone.

@teacher Hi Peter, what a surprise to see you here!
This is your music teacher.
@peter Hello Ms. Melody!
@teacher What are you doing here?

* @peter I'm looking for apples.
* @peter I'm buying food for dinner.
-

@peter We'll make an apple pie for my Grandma.
@teacher Great! I love apples too. I'm going to make apple sauce.
@teacher See you later! I'll stay a bit on the square to listen to the music.

-> market

=== music_teacher ===

{As you look around, you find your music teacher.|Your music teacher is still here.}
{She is holding a bag of apples.|}
{She is listening to the guitar.|}
{@teacher Hey Peter, what's up?|}

+ [Ask for apples]
    @peter Can you help me? I really need apples.
    @teacher I'll trade you these apples for some pears. Do you have any?
    ** {inventory ? pears} [Yes]
        @peter Yes.
        ~ inventory -= pears
        ~ inventory += (apples)
        @teacher Great, I love pears too! Here are your apples.
        @teacher See you on Monday, Peter!
        @peter Bye!
    ++ [No]
        @teacher That's too bad. Maybe next time.
    -- -> main_square
+ [Leave]
    -> main_square

=== home ===

VAR score = 0

You come back home. Your mom looks at your groceries.

@mom Let's see what you bought!

{inventory ? apples:
    ~ inventory -= apples
    @mom Great, you have the apples! I'll make an apple pie.
    ~ score += 10
- else:
    {
    - inventory ? pears:
        ~ inventory -= pears
        @mom No apples? Well, I can make a pear pie instead.
        ~ score += 5
    - inventory ? chocolate:
        ~ inventory -= chocolate
        @mom No apples or pears? I can use the chocolate to make a chocolate cake.
        ~ score += 5
    - else:
        @mom No fruit? So we won't have any dessert today.
    }
}

{inventory ? eggs:
  ~ score = score + 5
  ~ inventory -= eggs
  @mom Thank you for the eggs!
  - else:
  @mom It looks like you forgot the eggs.
}
{inventory ? tomatoes:
  ~ inventory -= tomatoes
  ~ score += 5
  @mom Nice, you have the tomatoes!
  - else:
  @mom Where are the tomatoes?
}
{inventory ? bread:
  ~ inventory -= bread
  ~ score += 5
  @mom The bread smells good.
  - else:
  @mom You didn't buy bread?
}

{
- score >= 25:
    Excellent job! You have got everything on the list!
    {treats == 0:
      But maybe you could have bought something for yourself?
     - else:
      And you still had enough coins to buy something you liked.
    }
    Your mom smiles warmly.
    @mom You did a great job, Peter. Thank you!
    @mom After dinner, you can play with your toys again.
    @mom But first, let's make the apple pie!
    $image grocery-pie.jpg
- score > 15:
    Good work! You got most of the items.
    @mom It's not perfect, but you did well, Peter. Thank you!
- else:
    @mom Lots of things are missing.
    @mom What are we going to have for dinner?
    @mom It's okay, Peter. I'm sure you'll do better next time.
}

-> END
