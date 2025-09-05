LIST items = pizza, salad, fish
VAR inventory = ()
VAR withAnna = false

-> start

=== start ===
You walk down the street on a sunny afternoon.
You are a little hungry, so you decide to stop at a café nearby.
The sign says: *Sunny Café*.

Inside, you hear people talking, cups clinking, and soft music playing.

*   [Sit inside near the window]
        You find a small table near the big window.
        You can see people walking by on the street.
        A waiter comes with a smile.
*   [Sit outside in the garden]
        You sit in the garden under a green umbrella.
        Birds sing, and the air smells of coffee and bread.
        A waiter walks over.
-

@Waiter Hello! Welcome to Sunny Café. Here is the menu.

*   [Look at the menu]
*   [Talk to the waiter first]
        You look at the waiter. He seems friendly.
        @You Hello. What do you recommend today?
        @Waiter The pizza is popular. Many people also like the fresh salad.
        * *   [Thank him and check the menu]

-

The menu has many choices.

*   [Order pizza]
       @You I would like the pizza, please.
       @Waiter Great choice! One pizza coming soon.
       ~ inventory += pizza
*   [Order salad]
       @You I would like the salad, please.
       @Waiter Healthy and fresh! I will bring it.
       ~ inventory += salad
*   [Order fish]
       @You I would like the fish, please.
       @Waiter Good choice! Please wait.
       ~ inventory += fish

-

You wait for your food. Time passes.
A person you know walks into the café.
It is your friend, Anna.
@anna Oh! Hi, it’s good to see you here. Can I join you?

*   [Invite Anna to sit with you] -> with_anna
*   [Say you want to be alone] -> alone

=== with_anna ===
~ withAnna = true

@You Of course, sit down!
Anna smiles and sits across from you.
@anna What did you order?
{inventory ? pizza:
    @You I ordered pizza.
}
{inventory ? salad:
    @You I ordered salad.
}
{inventory ? fish:
    @You I ordered fish.
}

@anna That sounds nice!

*   [Ask Anna about her day]
      -> anna_day
*   [Talk about your own day]
      @You Today I walked in the park and now I’m here. I just wanted to relax.
      @anna That sounds peaceful.
      -> food_arrives

=== alone ===
You smile politely but say:
@You Sorry, I just want to be alone today.
Anna nods.
@anna Okay, maybe next time.
She leaves, and you sit quietly until your food arrives.
-> food_arrives

=== anna_day ===
@You How was your day, Anna?
@anna Busy! I went shopping and studied English. I feel tired but happy.

*   [Tell her she works hard]
      @You You work very hard. That’s impressive.
      @anna Thank you! I try my best.
      -> food_arrives
*   [Change the topic]
      @You Let’s talk about something fun. Do you want to go to the cinema late?
      @anna That’s a nice idea!
      -> food_arrives

=== food_arrives ===
The waiter returns with a plate.

{inventory ? pizza:
    The pizza smells delicious, but wait… this is *salad*, not pizza!
}
{inventory ? salad:
    The salad looks fresh, but wait… this is *fish*, not salad!
}
{inventory ? fish:
    The fish is ready, but wait… this is *pizza*, not fish!
}

@You Excuse me, this is not what I ordered!

@Waiter Oh, I am very sorry! Let me check the kitchen.

*   [Accept the wrong food anyway] -> accept_food
*   [Ask him to bring the right order] -> correct_order

=== accept_food ===
You decide not to make a problem.
@You It’s okay, I will eat this.
The waiter looks relieved.
@Waiter Thank you for understanding.

*   [Eat and enjoy]
        You eat slowly. Even if it’s not what you wanted, the food is tasty.
        You feel calm as the day passes.
*   { withAnna} [Share the food with Anna]
        You share the food with Anna.
        @anna Thank you! It’s fun to share.
        You both laugh and enjoy the meal together.
        The sun goes down, and it was a good day.
- -> END


=== correct_order ===
@You Please bring the food I asked for.
@Waiter Of course, please wait a moment.
He goes back to the kitchen and soon returns with the correct plate.

*   [Eat and feel happy]
       The correct food is delicious! You enjoy every bite.
       You feel satisfied and relaxed.
*   [Taste and complain again]
       You taste the food but feel disappointed.
       @You Sorry, this is still not good.
       The waiter looks sad, and you feel the day is not as happy as you hoped.
- -> END
