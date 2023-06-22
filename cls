[33mcommit 5a6ee489c6dda3ca6cb243a29feab210005963fc[m[33m ([m[1;36mHEAD -> [m[1;32mchatzone-origin1[m[33m)[m
Author: Vendiola <jcvendiola@gmail.com>
Date:   Wed Jun 21 19:29:41 2023 +0800

    New Feature: Reset Password
    Implement the ability for users to reset their passwords using an automated URL sent to their email.
    Generate a unique token for each password reset request and include it in the reset URL.
    Send the password reset email to the user's registered email address with instructions and the reset URL.
    When the user clicks the reset URL, validate the token and allow them to enter a new password.
    Implement server-side validation for the new password and password confirmation fields.
    Update the user's password in the database once the reset is successful.
    Provide appropriate success and error messages throughout the password reset process.
    Write tests to ensure the functionality is working as expected.
    Commit message: Implement password reset feature with email integration

[33mcommit a79a3a1d16aa976fe4099d49c9002eebd358e501[m[33m ([m[1;31mchatzone/chatzone-origin1[m[33m)[m
Author: Vendiola <jcvendiola@gmail.com>
Date:   Mon Jun 19 15:38:24 2023 +0800

    New Features: Profile Edit
    - User can now edit his profile info, check his friend list and block list

[33mcommit 4efe62ea37cff7ebeacde681daab8f107d112cb8[m
Author: Vendiola <jcvendiola@gmail.com>
Date:   Tue Jun 13 17:58:10 2023 +0800

    Modify Readme

[33mcommit ffa52e46048af17efc0c368ea403bdc3504bf3ee[m
Author: Vendiola <jcvendiola@gmail.com>
Date:   Tue Jun 13 17:57:13 2023 +0800

    Modify Readme

[33mcommit 3074b4a36844e7fd146ac116f5fd78d84db4d912[m
Author: Vendiola <jcvendiola@gmail.com>
Date:   Tue Jun 13 17:30:05 2023 +0800

    add create new group chat feature

[33mcommit ed8dd02a4d8b3a0cb2fc530069d4951b26195d1a[m
Author: Vendiola <jcvendiola@gmail.com>
Date:   Tue Jun 13 08:38:14 2023 +0800

    Add Group Chat features

[33mcommit 27aa214bed75f674f9faa15e787d82ea166ddf3f[m[33m ([m[1;32mchatzone-origin[m[33m)[m
Author: jcarlo2 <jcvendiola@gmail.com>
Date:   Thu Jun 8 10:03:50 2023 +0800

    init, Websocket already working, can add friend, chat to a friend

[33mcommit a6bfbc7f90e33fd6cae3cb23f106c9689858c3b5[m[33m ([m[1;33mtag: v10.2.2[m[33m)[m
Author: Taylor Otwell <taylor@laravel.com>
Date:   Tue May 23 16:45:40 2023 -0500

    add lock path

[33mcommit fb8e9cee79bc3cebff9ee20068d95eefbb281aa7[m
Author: driesvints <driesvints@users.noreply.github.com>
Date:   Tue May 16 15:38:55 2023 +0000

    Update CHANGELOG

[33mcommit 953eae29387eb962b5e308a29f9a6d95de837ab0[m[33m ([m[1;33mtag: v10.2.1[m[33m)[m
Author: Jesse Leite <jesseleite@gmail.com>
Date:   Fri May 12 14:39:56 2023 -0400

    Bring back cluster config option, as required by pusher-js v8.0. (#6174)

[33mcommit 7e0a2db2e072436dd00a4fa129aebffb3c08d877[m
Author: Eliezer Margareten <46111162+emargareten@users.noreply.github.com>
Date:   Wed May 10 21:51:00 2023 +0300

    Add hashed cast to user password (#6171)
    
    * Add `hashed` cast to user password
    
    * Update composer.json

[33mcommit 90acdfe92be3c471f3fa2b599f8cabda43dbf245[m
Author: driesvints <driesvints@users.noreply.github.com>
Date:   Tue May 9 14:24:52 2023 +0000

    Update CHANGELOG

[33mcommit 150e379ce2f2af2205ce87839565acb8ac6ace2e[m[33m ([m[1;33mtag: v10.2.0[m[33m)[m
Author: Saya <379924+chu121su12@users.noreply.github.com>
Date:   Sat May 6 01:42:51 2023 +0800

    Update mail.php (#6170)

[33mcommit d3b2eada8618f8608c755137acc1741ec74771dc[m
Author: Tim MacDonald <hello@timacdonald.me>
Date:   Fri May 5 01:02:09 2023 +1000

    Migrate to modules (#6090)

[33mcommit d14bdeeb6db121cc7d181ce5497211612ce4bc10[m
Author: Ayman Atmeh <ayman.atmeh@gmail.com>
Date:   Wed Apr 26 16:39:12 2023 +0300

    Update welcome.blade.php (#6163)
    
    "Set z-index to 10 for Login/Register container to ensure it appears on top of other elements"

[33mcommit 5070934fc5fb8bea7a4c8eca44a6b0bd59571be7[m
Author: driesvints <driesvints@users.noreply.github.com>
Date:   Tue Apr 18 16:22:10 2023 +0000

    Update CHANGELOG

[33mcommit ec38e3bf7618cda1b44c79f907590d4f97749d96[m[33m ([m[1;33mtag: v10.1.1[m[33m)[m
Author: Julius Kiekbusch <jubeki99@gmail.com>
Date:   Tue Apr 18 18:21:20 2023 +0200

    Fix laravel/framework constraints for Default Service Providers (#6160)

[33mcommit 05a41f8a4bf428070cb5cbe0d4f94b85ee6d9bd7[m
Author: driesvints <driesvints@users.noreply.github.com>
Date:   Tue Apr 18 14:05:48 2023 +0000

    Update CHANGELOG

[33mcommit badcf92f91c90a43c6d559002a5be19cfce9eb97[m
Author: driesvints <driesvints@users.noreply.github.com>
Date:   Tue Apr 18 14:05:26 2023 +0000

    Update CHANGELOG

[33mcommit ebf9d30bf3cf41c376e5b2e1ba1b51882d200848[m[33m ([m[1;33mtag: v10.1.0[m[33m)[m
Author: Taylor Otwell <taylor@laravel.com>
Date:   Sat Apr 15 16:53:39 2023 -0500

    [10.x] Minor skeleton slimming (#6159)
    
    * remove rate limiter from route provider by default
    
    * remove policy place holder
    
    * remove broadcast skeleton in favor of new provider in core
    
    * use default provider collection
    
    * Remove unnecessary properties from exception handler.
    
    * add back broadcast provider
    
    * update comment
    
    * add rate limiting
    
    * Apply fixes from StyleCI
    
    * fix formatting
    
    ---------
    
    Co-authored-by: StyleCI Bot <bot@styleci.io>

[33mcommit 64685e6f206bed04d7785e90a5e2e59d14966232[m[33m ([m[1;33mtag: v10.0.7[m[33m)[m
Author: Nuno Maduro <enunomaduro@gmail.com>
Date:   Fri Apr 14 15:03:05 2023 +0100

    Adds `phpunit/phpunit@10.1` support (#6155)

[33mcommit 7cc6699c3d118a5d258a9b23a91478352e26a7d8[m
Author: Taylor Otwell <taylor@laravel.com>
Date:   Tue Apr 11 17:17:21 2023 -0500

    clean up comment

[33mcommit a25f40590b302b7673ca805eab83aaabfaee1b26[m
Author: driesvints <driesvints@users.noreply.github.com>
Date:   Tue Apr 11 16:36:22 2023 +0000

    Update CHANGELOG

[33mcommit 0bcd012dc0abf47e5eee45daa6bfc0222e2971f3[m[33m ([m[1;33mtag: v10.0.6[m[33m)[m
Author: André Olsen <andreolsen4200@gmail.com>
Date:   Wed Apr 5 17:03:08 2023 +0200

    Add job batching options to Queue configuration file (#6149)
    
    * add batching config options to queue config file
    
    This adds the batching configuration options to the queue configuration skeleton, so everyone has a faster way of knowing that it's possible to customize the database connection and table options.
    
    * formatting
    
    ---------
    
    Co-authored-by: Taylor Otwell <taylor@laravel.com>

[33mcommit 9184b212130a1eaf95513198f27569f6b9126602[m
Author: driesvints <driesvints@users.noreply.github.com>
Date:   Tue Mar 28 18:05:26 2023 +0000

    Update CHANGELOG

[33mcommit 9ae75b58a1ffc00ad36bf1e877fe2bf9ec601b82[m[33m ([m[1;33mtag: v10.0.5[m[33m)[m
Author: Alan Poulain <contact@alanpoulain.eu>
Date:   Wed Mar 8 17:57:09 2023 +0100

    [10.x] Add replace_placeholders to log channels (#6139)
    
    * add replace_placeholders to log channels
    
    * Update logging.php
    
    ---------
    
    Co-authored-by: Taylor Otwell <taylor@laravel.com>

[33mcommit d39fb35b4d1192e434b77240547c9a0896aae7e2[m
Author: driesvints <driesvints@users.noreply.github.com>
Date:   Thu Mar 2 16:19:33 2023 +0000

    Update CHANGELOG

[33mcommit 22df611a2fe1e95e262643382d583ee0dbbca360[m[33m ([m[1;33mtag: v10.0.4[m[33m)[m
Author: Nico <3315078+nicolus@users.noreply.github.com>
Date:   Mon Feb 27 19:37:48 2023 +0100

    Specify facility in the syslog driver config (#6130)

[33mcommit a337b99dfbc9e5c8d01d3358844cbd57adf6096a[m
Author: Izzudin Anuar <izzudinanuar96@gmail.com>
Date:   Sun Feb 26 07:07:54 2023 +1300

    Fix typo (#6128)

[33mcommit 9507bf2b2ad9656eabbb7176b554791c5c402026[m
Author: driesvints <driesvints@users.noreply.github.com>
Date:   Tue Feb 21 15:35:21 2023 +0000

    Update CHANGELOG

[33mcommit 37ab32cf760406f767f6a278748546214585c93f[m[33m ([m[1;33mtag: v10.0.3[m[33m)[m
Author: Dries Vints <dries@vin