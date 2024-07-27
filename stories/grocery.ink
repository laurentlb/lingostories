LIST items = apples, pears, tomatoes, carrots, chocolate, eggs, bread, pastry
VAR inventory = ()
VAR money = 0
VAR teacher = false
VAR treats = 0

/*
Costs:
  Pears (5), Tomatoes (3), eggs(4), bread(3)
*/

-> introduction

=== function buy(item, cost) ===
{money >= cost :
  ~ money -= cost
  ~ inventory += item
  ~ return true
- else:
  It looks like you don't have enough money.
  ~ return false
}


=== introduction ===
It's Saturday afternoon.
You live in a village.
It's a bit cold outside.
So you play in your bedroom with your toys.
Your mum calls.

- (loop1)
{&@mum Peter!|@mum Peter, please come here.}
* [Leave the bedroom] -> downstairs
+ [Keep playing]
  You keep playing a few more minutes.
  -> loop1

= downstairs

You leave the bedroom and see your mum.

@mum Can you please buy groceries for dinner?
@mum Granny is visiting, so it's important to get everything.
@mum I need you to buy 3 tomatoes, 4 eggs and 5 apples.
@mum You'll find everything in the supermarket.
@mum Here are 17 coins, it should be enough.
~ money += 17
@mum Oh, and we also need bread!

- (loop2)
* @peter Can I stay home?
    @peter I'd like to play more.
    @mum No, it's important to have food for dinner. You can play later.
* @peter How do I go to the supermarket?
    @mum Go at the end of the street and turn right. It's on the main square.
* @peter Can you repeat the grocery list?
    @mum Sure. We need 3 tomatoes, 4 eggs, 5 apples, and bread.
* @peter Can I buy something for me?
    @peter I'd like to get something sweet this afternoon.
    @mum If you have enough coins, you can buy something for you.
    @mum But first, please buy the food for dinner.
* [Leave] -> travel
- -> loop2

=== travel ===

You leave the house.
It is sunny with a bit of wind.
It's not that cold.
You see kids playing in the park as you walk by.
You walk down the street until the end.
@peter Which way is it? I think I should go left now.
* [Go left] -> lost
* [Go right] -> main_square

=== lost ===

{&After a few minutes, you find another crossroad.|You feel lost and see another crossroad.|Yet another crossroad? Where should I go?}
{&@peter Is it the street on the right? I'm not sure.|}

+ [Go left] -> lost
+ [Go right] -> lost
+ [Go straight] -> lost
+ [Go back]
     You decide to go back.
    You are scared of getting lost.
    But after a while, it starts feeling familiar.
    -> main_square

=== main_square ===
{!You reach the main square.|There are many people on the main square.|A street musician is playing guitar on the main square.|On the main square, a group of tourists is taking photos of the old buildings.}
{!The supermarket is right in front of you.}

+ [Go to the supermarket]
    -> supermarket
+ [Go to the bakery]
    -> bakery
+ [Go to the outdoor market]
    -> market
+ {teacher && not (inventory ? apples)} [Look for your music teacher]
    -> music_teacher
+ {inventory ? chocolate} [Eat chocolate]
    The chocolate tastes delicious.
    ~ inventory -= chocolate
    -> main_square
+ {inventory ? pastry} [Eat the pastry]
    The pastry is really good.
    ~ inventory -= pastry
    -> main_square
+ {money < 16 && money > 1} [Go back home]
    @peter I still have some coins to spend.
    ** [Go back home] -> home
    ** [Stay] -> main_square
+ {money < 16 && money <= 1} [Go back home]
    -> home

=== supermarket ===

{!You enter the supermarket.}
{!It's hard to find what you want.}
{!An employee asks if you need help.}
@employee What are you looking for?

- (loop)
* [Tomatoes]
    @employee Sorry, we're out of tomatoes.
    @employee But they should have tomatoes on the market.
* [Apples]
    @employee I don't know why everyone wants apples today.
    @employee Unfortunately, we don't have any more.
+ {not (inventory ? eggs)} [Eggs]
    @employee How many eggs do you want?
    ** [4 eggs (4🪙)]
        ~ buy(eggs, 4)
    ** [6 eggs (6🪙)]
        ~ buy(eggs, 6)
    ** [12 eggs (9🪙)]
        ~ buy(eggs, 9)
* [Bread]
    @employee Unfortunately, we don't have bread anymore.
    @employee But there's a bakery nearby.
* [Wine]
    @employee How old are you?
    ** [10 years old] @peter I am 10 years old.
    ** [Lie] @peter I am... 11 years old!
    -- @employee Sorry, you're too young to buy wine.
* [Chocolate (2🪙)]
    ~ buy(chocolate, 2)
+ [Leave]
   You leave the supermarket.
   -> main_square

- -> loop

=== bakery ===

You enter the bakery.
{!It smells like fresh bread}
{!You see your favorite pastry.}
{!The baker smiles at you.}

@baker Hello Peter, what would you like?

- (loop)
* {not apples} [Apples]
    Sorry, this is a bakery, we don't sell apples.
* {not (inventory ? pastry)} [Pastry (2🪙)]
    {buy(pastry, 2):
        ~ treats += 1
        @baker Enjoy!
    }
* {not (inventory ? pastry)} [Bigger pastry (4🪙)]
    {buy(pastry, 4):
        ~ treats += 1
        @baker Enjoy!
    }
* [Bread (3🪙)]
    ~ buy(bread, 3)
+ [Leave]
    @baker See you soon, Peter!
    -> main_square
- -> loop

=== market ===

@seller Hello Peter! What would you like today?

- (loop)
* [Apples]
    @seller Sorry, we just sold the last apples to your music teacher.
    Would you like pears instead?
    ~ teacher = true
* [Pears (5🪙)]
    ~ buy(pears, 5)
+ {not (inventory ? tomatoes)} [Tomatoes]
    @seller How many tomatoes do you want?
    ++ [3]
        @seller Do you mean 3 tomatoes or 3 kilograms of tomatoes?
        +++ [3 tomatoes (3🪙)]
            ~ buy(tomatoes, 3)
        +++ [3 kilograms of tomatoes (9🪙)]
            ~ buy(tomatoes, 9)
    ++ [4]
        ~ buy(tomatoes, 4)
    ++ [5]
        ~ buy(tomatoes, 5)
* [Carrots (2🪙)]
    ~ buy(carrots, 2)
+ [Leave]
    @seller See you soon!
    -> main_square

- -> loop

=== music_teacher ===

{As you look around, you see your music teacher.|Your music teacher is still here.}
{!She is holding a bag of apples.}
{!She waves at you.}
{!@teacher Hi Peter, what a surprise to see you here!}

+ [Ask for apples]
    @teacher I'll trade you these apples for some pears. Do you have any?
    ** {inventory ? pears} [Yes]
        ~ inventory -= pears
        ~ inventory += (apples)
        @teacher Great, I love pears too! Here are your apples.
        @teacher See you on Monday, Peter!
    ++ [No]
        @teacher That's too bad. Maybe next time.
    -- -> main_square
+ [Leave]
    -> main_square

=== home ===

VAR score = 0

You come back home. Your mum looks at your groceries.

She smiles.
@mum Let's see what you bought!

{inventory ? apples:
    @mum Great, you have the apples! I'll make an apple pie.
    ~ score += 10
- else:
    {
    - inventory ? pears:
        @mum No apples? Well, I can make a pear pie instead.
        ~ score += 5
    - inventory ? chocolate:
        @mum No apples or pears? I can use the chocolate to make a chocolate cake.
        ~ score += 5
    - else:
        @mum No fruit? So we won't have any dessert today.
    }
}

{inventory ? eggs:
  ~ score = score + 5
  @mum Thank you for the eggs!
  - else:
  @mum It looks like you forgot the eggs.
}
{inventory ? tomatoes:
  ~ score += 5
  @mum Nice, you have the tomatoes!
  - else:
  @mum Where are the tomatoes?
}
{inventory ? bread:
  ~ score += 5
  @mum The bread smells good.
  - else:
  @mum You didn't buy bread?
}

{
- score >= 25:
    Excellent job! You have got everything on the list!
    {treats == 0:
      But maybe you could have bought something for you?
     - else:
      And you still had enough coins to buy something you liked.
    }
    You mum smiles warmly.
    @mum You did a great job, Peter. Thank you!
    @mum After dinner, you can play with your toys again.
- score > 15:
    Good work! You got most of the items.
    @mum It's not perfect, but you did well, Peter. Thank you!
- else:
    @mum Lots of things are missing.
    @mum What are going to have for dinner?
    @mum It's okay, Peter. I'm sure you'll do better next time.
}

-> END
