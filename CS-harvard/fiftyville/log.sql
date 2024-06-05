-- Keep a log of any SQL queries you execute as you solve the mystery.

select description from crime_scene_reports where description like "%theft%" AND year=2023 AND month=7 AND day=28;
>>>
        | Theft of the CS50 duck took place at 10:15am at the Humphrey Street bakery. Interviews were conducted today with three witnesses who were present at the time – each of their interview transcripts mentions the bakery. |


STEP : 1
select * from interviews WHERE year=2023 AND month=7 and day=28 AND transcript LIKE "%bakery%" ;
        id   name     year  month  day  transcript
        ---  -------  ----  -----  ---  ------------------------------------------------------------
        161  Ruth     2023  7      28   Sometime within ten minutes of the theft, I saw the thief ge
                                        t into a car in the bakery parking lot and drive away. If yo
                                        u have security footage from the bakery parking lot, you mig
                                        ht want to look for cars that left the parking lot in that t
                                        ime frame.

        162  Eugene   2023  7      28   I don't know the thief's name, but it was someone I recogniz
                                        ed. Earlier this morning, before I arrived at Emmas bakery,
                                        I was walking by the ATM on Leggett Street and saw the thie
                                        f there withdrawing some money.

        163  Raymond  2023  7      28   As the thief was leaving the bakery, they called someone who
                                        talked to them for less than a minute. In the call, I heard
                                        the thief say that they were planning to take the earliest
                                        flight out of Fiftyville tomorrow. The thief then asked the
                                        person on the other end of the phone to purchase the flight
                                        ticket.
STEP : 2
-- As per Ruth he say theif left bakery at 10:15am to 10:25 am
select people.*  from atm_transactions, bank_accounts, people WHERE people.id=bank_accounts.person_id AND bank_accounts.account_number=atm_transactions.account_number AND  atm_location="Leggett Street" AND year=2023 AND month=7 AND day=28 AND transaction_type="withdraw" AND license_plate in (SELECT license_plate FROM bakery_security_logs WHERE year=2023 AND month=7 AND day=28 AND hour=10 AND minute>15 AND minute<25);
        +--------+-------+----------------+-----------------+---------------+
        |   id   | name  |  phone_number  | passport_number | license_plate |
        +--------+-------+----------------+-----------------+---------------+
        | 686048 | Bruce | (367) 555-5533 | 5773159633      | 94KL13X       |
        | 514354 | Diana | (770) 555-1861 | 3592750733      | 322W7JE       |
        | 396669 | Iman  | (829) 555-5269 | 7049073643      | L93JTIZ       |
        | 467400 | Luca  | (389) 555-5198 | 8496433585      | 4328GD8       |
        +--------+-------+----------------+-----------------+---------------+

STEP : 3
-- As per Raymond called for less than a minutes
SELECT * FROM phone_calls WHERE year=2023 AND month=7 AND day=28 AND duration<60 AND caller in (select people.phone_number  from atm_transactions, bank_accounts, people WHERE people.id=bank_accounts.person_id AND bank_accounts.account_number=atm_transactions.account_number AND  atm_location="Leggett Street" AND year=2023 AND month=7 AND day=28 AND transaction_type="withdraw") AND caller in (select phone_number  from atm_transactions, bank_accounts, people WHERE people.id=bank_accounts.person_id AND bank_accounts.account_number=atm_transactions.account_number AND  atm_location="Leggett Street" AND year=2023 AND month=7 AND day=28 AND transaction_type="withdraw" AND license_plate in (SELECT license_plate FROM bakery_security_logs WHERE year=2023 AND month=7 AND day=28 AND hour=10 AND minute>15 AND minute<25));
        +-----+----------------+----------------+------+-------+-----+----------+
        | id  |     caller     |    receiver    | year | month | day | duration |
        +-----+----------------+----------------+------+-------+-----+----------+
        | 233 | (367) 555-5533 | (375) 555-8161 | 2023 | 7     | 28  | 45       |
        | 255 | (770) 555-1861 | (725) 555-3243 | 2023 | 7     | 28  | 49       |
        +-----+----------------+----------------+------+-------+-----+----------+

STEP : 4
-- As per Raymond ,they were planning to take the earliest flight out of Fiftyville tomorrow
SELECT people.* FROM passengers, people WHERE passengers.passport_number=people.passport_number AND flight_id = (SELECT id FROM flights WHERE year=2023 AND month=7 AND day=29 ORDER BY hour ASC LIMIT 1) AND passengers.passport_number in (select people.passport_number  from atm_transactions, bank_accounts, people WHERE people.id=bank_accounts.person_id AND bank_accounts.account_number=atm_transactions.account_number AND  atm_location="Leggett Street" AND year=2023 AND month=7 AND day=28 AND transaction_type="withdraw");
        +--------+--------+----------------+-----------------+---------------+
        |   id   |  name  |  phone_number  | passport_number | license_plate |
        +--------+--------+----------------+-----------------+---------------+
        | 686048 | Bruce  | (367) 555-5533 | 5773159633      | 94KL13X       |
        | 449774 | Taylor | (286) 555-6063 | 1988161715      | 1106N58       |
        | 395717 | Kenny  | (826) 555-1652 | 9878712108      | 30G67EN       |
        | 467400 | Luca   | (389) 555-5198 | 8496433585      | 4328GD8       |
        +--------+--------+----------------+-----------------+---------------+

step:5 ::: Theif Identified : BRUCE
-- combine step 4 and 3
SELECT people.* FROM passengers, people WHERE passengers.passport_number=people.passport_number AND flight_id = (SELECT id FROM flights WHERE year=2023 AND month=7 AND day=29 ORDER BY hour ASC LIMIT 1) AND passengers.passport_number in (select people.passport_number  from atm_transactions, bank_accounts, people WHERE people.id=bank_accounts.person_id AND bank_accounts.account_number=atm_transactions.account_number AND  atm_location="Leggett Street" AND year=2023 AND month=7 AND day=28 AND transaction_type="withdraw") AND phone_number in (SELECT caller FROM phone_calls WHERE year=2023 AND month=7 AND day=28 AND duration<60 AND caller in (select people.phone_number  from atm_transactions, bank_accounts, people WHERE people.id=bank_accounts.person_id AND bank_accounts.account_number=atm_transactions.account_number AND  atm_location="Leggett Street" AND year=2023 AND month=7 AND day=28 AND transaction_type="withdraw") AND caller in (select phone_number  from atm_transactions, bank_accounts, people WHERE people.id=bank_accounts.person_id AND bank_accounts.account_number=atm_transactions.account_number AND  atm_location="Leggett Street" AND year=2023 AND month=7 AND day=28 AND transaction_type="withdraw" AND license_plate in (SELECT license_plate FROM bakery_security_logs WHERE year=2023 AND month=7 AND day=28 AND hour=10 AND minute>15 AND minute<25)));
        +--------+-------+----------------+-----------------+---------------+
        |   id   | name  |  phone_number  | passport_number | license_plate |
        +--------+-------+----------------+-----------------+---------------+
        | 686048 | Bruce | (367) 555-5533 | 5773159633      | 94KL13X       |
        +--------+-------+----------------+-----------------+---------------+


-- The city the thief ESCAPED TO????
select city  FROM  airports,flights WHERE flights.destination_airport_id=airports.id AND  year=2023 AND month=7 AND day=29 ORDER BY hour ASC LIMIT 1;
        +---------------+
        |     city      |
        +---------------+
        | New York City |
        +---------------+

-- The ACCOMPLICE is: Robin since he helped the bruce to escape
 select * from people WHERE phone_number = ( SELECT receiver FROM phone_calls WHERE caller ='(367) 555-5533' AND year=2023 AND month=7 AND day=28 AND duration<60);
        +--------+-------+----------------+-----------------+---------------+
        |   id   | name  |  phone_number  | passport_number | license_plate |
        +--------+-------+----------------+-----------------+---------------+
        | 864400 | Robin | (375) 555-8161 | NULL            | 4V16VO0       |
        +--------+-------+----------------+-----------------+---------------+
