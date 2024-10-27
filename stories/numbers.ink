VAR minNumber = 0
VAR maxNumber = 0
VAR guess = 0
~ minNumber = RANDOM(1, 20)
~ maxNumber = RANDOM(70, 99)

@peter Choose a number.
@peter I will try to guess your number.
@peter The number should greater than...
@peter {minNumber}
@peter but it should also be less than
@peter {maxNumber}
@peter Have you chosen a number?

* [Yes.]
    @you Yes, we can start.
    -> loop

= loop

~ guess = (minNumber + maxNumber) / 2

@peter {&I think it is... | Or maybe... | My guess is... | Is it... }
@peter {guess}

 + {guess < maxNumber} [My number is greater than {guess}.]
    @you My number is greater.
    ~ minNumber = guess + 1
 + {guess > minNumber} [My number is less than {guess}.]
    @you My number is smaller.
    ~ maxNumber = guess - 1
 + [Correct! It was {guess}.]
    @you This is correct!
    -> END

- -> loop


    -> END
