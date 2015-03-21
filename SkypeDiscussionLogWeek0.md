# Week 0: October 15 to 22 #
```
[10/19/2011 3:46:49 PM] *** Nuno Linhares added Chris Summers ***
[10/19/2011 3:46:53 PM] *** Nuno Linhares added Albert Romkes ***
[10/19/2011 3:46:56 PM] *** Nuno Linhares added Alvin Reyes ***
[10/19/2011 3:47:21 PM] *** Nuno Linhares added Frank van Puffelen ***
[10/19/2011 3:47:35 PM] Nuno Linhares: OK, I think we can all add people here, right?
[10/19/2011 3:47:39 PM] Nuno Linhares: I hope anyway
[10/19/2011 3:48:29 PM] Peter Kjaer: I guess so - I don't know how the other one was made
[10/19/2011 3:48:40 PM] Nuno Linhares: very carefully
[10/19/2011 3:49:11 PM] Peter Kjaer: hehe
[10/19/2011 3:49:20 PM] Chris Summers: Well what fun.... another place to chat
[10/19/2011 3:49:45 PM] *** Nuno Linhares added Mihai Cadariu ***
[10/19/2011 3:50:36 PM] Peter Kjaer: looks better after I renamed the group to "Tridion PowerTools 2011" :)
[10/19/2011 3:50:57 PM] Nuno Linhares: Looks much better
[10/19/2011 3:51:13 PM] Mihai Cadariu: hi everybody
[10/19/2011 3:51:14 PM] Peter Kjaer: does it share the name?
[10/19/2011 3:51:22 PM] Peter Kjaer: hello Mihai
[10/19/2011 3:51:31 PM] Chris Summers: hi
[10/19/2011 3:51:57 PM] Nuno Linhares: just so you know Mihai, we completely changed everything in the powertools
[10/19/2011 3:52:05 PM] Nuno Linhares: Well, Peter did
[10/19/2011 3:52:13 PM] Nuno Linhares: I mostly broke it
[10/19/2011 3:53:05 PM] Mihai Cadariu: yes, i saw the email from Peter, but didn't go into details
[10/19/2011 3:53:28 PM] Nuno Linhares: And we were discussing also changing some namespaces and folder names
[10/19/2011 3:53:48 PM] *** Nuno Linhares added Angel Puntero ***
[10/19/2011 3:53:58 PM] Chris Summers: I just put a note on IRC to join here for PT stuff
[10/19/2011 3:54:23 PM] Angel Puntero: Hello everybody
[10/19/2011 3:54:30 PM] Albert Romkes: Hi
[10/19/2011 3:54:54 PM] Alvin Reyes: Hi
[10/19/2011 3:55:02 PM] Angel Puntero: so we have jumped from 1995 to the present :)
[10/19/2011 3:55:23 PM] Chris Summers: See you all later, I have to get in the car
[10/19/2011 3:55:36 PM | Edited 3:55:39 PM] Nuno Linhares: bye Chris
[10/19/2011 3:55:40 PM] Alvin Reyes: take care
[10/19/2011 3:55:47 PM] Peter Kjaer: http://groups.google.com/group/tridion-powertools/t/9a879aeb338ce938
[10/19/2011 3:55:49 PM] Nuno Linhares: yup, using Microsoft Skype now...
[10/19/2011 3:55:55 PM] Peter Kjaer: see ya Chris
[10/19/2011 3:56:15 PM] Alvin Reyes: if we cant to consider jumping into the future we can check out google
[10/19/2011 3:56:27 PM] Angel Puntero: that still sounds weird, the word Microsoft in that phrase
[10/19/2011 3:56:33 PM] Alvin Reyes: (there's even an api for future modeling http://code.google.com/apis/predict/docs/getting-started.html)
[10/19/2011 4:01:46 PM] Nuno Linhares: Angel, Peter's been busy refactoring the hell out of the powertools, so don't be surprised if it breaks for you
[10/19/2011 4:02:32 PM] Angel Puntero: Yeah, I have just read the message in the group, sounds like a nice revamp
[10/19/2011 4:02:50 PM] Angel Puntero: It´s always a pain, having to write all that boilerplate code for the proxy js
[10/19/2011 4:02:50 PM] Alvin Reyes: btw, I piggy-backed on your post Peter by mentioning this skype chat
[10/19/2011 4:03:47 PM] *** Nuno Linhares added Vesa Paakkanen ***
[10/19/2011 4:03:49 PM] Albert Romkes: Peter, in the ImageUploader.js was/is an error....
[10/19/2011 4:04:01 PM] Peter Kjaer: yeah, I wanted to get in the change before too many people started working on it. I won't be refactoring big things like that without notice in the future :)
[10/19/2011 4:04:09 PM] Albert Romkes: p.proxy = new... Referencing to the old service proxy...
[10/19/2011 4:04:19 PM] Albert Romkes: Or is Ankh playing with me?
[10/19/2011 4:04:25 PM] Peter Kjaer: again?
[10/19/2011 4:04:33 PM] Peter Kjaer: bloody hell
[10/19/2011 4:04:37 PM] Nuno Linhares: [Wednesday, October 19, 2011 4:04 PM] Albert Romkes: 

<<< Or is Ankh playing with me?I suspect Ankh is not reliable
[10/19/2011 4:04:38 PM] Albert Romkes: This was it:
[10/19/2011 4:04:39 PM] Albert Romkes: p.proxy = new PowerTools2011.Services.ImageUploaderServiceProxy();
[10/19/2011 4:04:51 PM] Peter Kjaer: yeah, it should just be removed
[10/19/2011 4:04:52 PM] Albert Romkes: I changed it to
[10/19/2011 4:04:53 PM] Albert Romkes: p.proxy = new PowerTools2011.Model.Services.ImageUploader();
[10/19/2011 4:05:04 PM] Albert Romkes: And then everything works
[10/19/2011 4:05:07 PM] Peter Kjaer: we don't use the proxy class
[10/19/2011 4:05:08 PM] Nuno Linhares: this is what I have too
[10/19/2011 4:05:09 PM] Nuno Linhares: p.proxy = new PowerTools2011.Services.ImageUploaderServiceProxy();
[10/19/2011 4:05:26 PM] Nuno Linhares: and i just got a fresh copy. Maybe Vesa was right and we should not use SVN ;)
[10/19/2011 4:06:00 PM] Peter Kjaer: okay, well I just shot down my image and opened a brew - so could one of you guys just remote the line and check it in? :)
[10/19/2011 4:06:10 PM] Nuno Linhares: :)
[10/19/2011 4:06:21 PM] Peter Kjaer: *remove
[10/19/2011 4:06:26 PM] Nuno Linhares: I vote for Albert
[10/19/2011 4:06:30 PM] Albert Romkes: :D
[10/19/2011 4:06:36 PM] Albert Romkes: give me 10 secs
[10/19/2011 4:06:41 PM] Albert Romkes: if anks plays along
[10/19/2011 4:07:02 PM] Peter Kjaer: I wouldn't blame SVN for my mistakes :)
[10/19/2011 4:07:33 PM] Nuno Linhares: just pick someone who is offline and blame that person. I blame Chris Summers
[10/19/2011 4:07:45 PM] Albert Romkes: yeah. Chris did it for sure.
[10/19/2011 4:07:46 PM] Albert Romkes: He always does
[10/19/2011 4:07:49 PM] Alvin Reyes: Yeah, the whole reboot was partly/mostly? his idea.
[10/19/2011 4:08:02 PM] Peter Kjaer: hehe
[10/19/2011 4:08:19 PM] Alvin Reyes: Who knew to do this we just needed to go from .asp to...
[10/19/2011 4:08:49 PM] Alvin Reyes: JQuery, Anguilla, MVC, new Core, context-sensitive placement, Google Code, Skype...
[10/19/2011 4:09:20 PM] Alvin Reyes: (miss any technology or framework?)
[10/19/2011 4:09:34 PM] Peter Kjaer: hehe :)
[10/19/2011 4:11:45 PM] Alvin Reyes: I'm glad we have help, welcome Angel and Vesa and this Mihai guy.
[10/19/2011 4:12:21 PM] Angel Puntero: thank you, glad to help!
[10/19/2011 4:12:29 PM] Nuno Linhares: be careful about Mihai... he's eastern european ;)
[10/19/2011 4:12:43 PM] Albert Romkes: Ok. Checked in. Finally!
[10/19/2011 4:13:04 PM] Albert Romkes: Anyone knows another svn client?
[10/19/2011 4:13:12 PM] Alvin Reyes: (that rides motorcycles for fun)
[10/19/2011 4:13:12 PM] Mihai Cadariu: :)
[10/19/2011 4:13:26 PM] Nuno Linhares: Tortoise SVN is good, but I don't think it integrates directly with Visual Studio
[10/19/2011 4:13:36 PM] Alvin Reyes: @Albert there's a wiki page for that
[10/19/2011 4:13:38 PM] Alvin Reyes: http://code.google.com/p/tridion-2011-power-tools/wiki/SourceControl
[10/19/2011 4:13:44 PM] Albert Romkes: hehe
[10/19/2011 4:13:47 PM] Peter Kjaer: I use SmartSVN but as you saw, it doesn't prevent you from screwing up if you've forgotten how SVN works :)
[10/19/2011 4:14:20 PM] Angel Puntero: Tortoise works well, but it´s a shell extension, not VS addin
[10/19/2011 4:14:42 PM] Angel Puntero: anyway ankh should work well too :P
[10/19/2011 4:15:00 PM] Mihai Cadariu: i use both tortoise and vs akn, but i do my check-ins with tortoise shell extension
[10/19/2011 4:15:06 PM] Albert Romkes: It could be google.code...
[10/19/2011 4:15:07 PM | Edited 4:15:10 PM] Mihai Cadariu: akn is weird
[10/19/2011 4:15:55 PM] Angel Puntero: i do the same Mihai
[10/19/2011 4:17:40 PM] Alvin Reyes: perfect, I put that scenario on the wiki
[10/19/2011 4:25:23 PM] Peter Kjaer: I like the activity I'm seeing on the Wiki. I still need to read through it all, but I just wanted to say that :)
[10/19/2011 4:26:38 PM] Mihai Cadariu: so much content.. so little time ;)
[10/19/2011 4:27:04 PM] Peter Kjaer: indeed
[10/19/2011 4:34:13 PM] Peter Kjaer: alright, I'm done for the day - see you later!
[10/19/2011 4:34:24 PM] Albert Romkes: see you
[10/19/2011 4:35:10 PM] *** Albert Romkes added John Winter ***
[10/19/2011 4:36:12 PM] Nuno Linhares: shh, John is here now
[10/19/2011 4:37:16 PM] John Winter: hello all
[10/19/2011 4:37:23 PM] John Winter: hope you're all doing great
[10/19/2011 4:37:35 PM] Angel Puntero: Hello
[10/19/2011 4:37:49 PM] Albert Romkes: Hi John
[10/19/2011 4:38:21 PM] John Winter: I should be pulling my finger out next week for the power tools, i don't have too much work on
[10/19/2011 4:38:49 PM] Nuno Linhares: right. No point in working any more on this. We can let John figure it out by himself
[10/19/2011 4:38:49 PM] John Winter: is there a list of tasks that are assigned to techies?
[10/19/2011 4:38:57 PM] John Winter: sounds great
[10/19/2011 4:39:03 PM] John Winter: what do you need?
[10/19/2011 4:39:18 PM] Albert Romkes: Noticed that ank doesn't act as expected (compared to TFS) when fetching the latest version...
[10/19/2011 4:39:22 PM] John Winter: i have 2 other tridioners with me at the moment and tomorrow we're basically tossing off
[10/19/2011 4:39:57 PM] Albert Romkes: Its (trying) to merge the changes. But fails big time...
[10/19/2011 4:40:24 PM] Albert Romkes: be careful
[10/19/2011 4:41:36 PM] John Winter: what is it you need to figure out?
[10/19/2011 4:42:01 PM] Albert Romkes: Of course everybody knows this, but before committing we should do a 'Get latest version'...
[10/19/2011 4:44:29 PM] Albert Romkes: John, check out the Wiki...
[10/19/2011 4:44:37 PM] Albert Romkes: Lots of info there...
[10/19/2011 4:46:26 PM] John Winter: ok will do
[10/19/2011 5:16:10 PM] Alvin Reyes: nice, a fresh volunteer!
[10/19/2011 5:18:51 PM] Alvin Reyes: stuff you could check out, John:
1) add yourself here: http://code.google.com/p/tridion-2011-power-tools/wiki/Tasks
2) review/add to: http://code.google.com/p/tridion-2011-power-tools/wiki/Standards
3) when ready, add/review notes on the tools and then follow the guide:
  - http://code.google.com/p/tridion-2011-power-tools/wiki/DevelopmentTools
  - http://code.google.com/p/tridion-2011-power-tools/wiki/nononsenseguide
[10/19/2011 5:20:08 PM] Alvin Reyes: The last two work together since the nunosense guide assumes we know what we're doing. Since I know I don't, I wanted a "tools" guide for us to complai...I mean share behind-the-scenes/between-the-lines info.
[10/19/2011 5:27:46 PM] Angel Puntero: time to get some sleep for me
[10/19/2011 5:28:19 PM] Angel Puntero: see you guys
[10/19/2011 5:28:29 PM] Albert Romkes: see you
[10/19/2011 5:28:29 PM] Alvin Reyes: take care
[10/19/2011 5:28:31 PM] Nuno Linhares: bye Angel
[10/19/2011 5:28:36 PM] John Winter: Good night Angel
[10/19/2011 6:13:38 PM] Chris Summers: Guess I joined abit late
[10/19/2011 6:13:43 PM] Chris Summers: back at my screen now
[10/19/2011 8:19:03 PM] Alvin Reyes: Senor Summers, the original PowerTools priority matrix (Excel spreadsheet) served us well. We're now on the wiki going forward: http://code.google.com/p/tridion-2011-power-tools/wiki/Requirements
[10/19/2011 8:19:28 PM] Alvin Reyes: I'm out for now, see ya all.
[10/20/2011 6:57:58 AM] *** Nuno Linhares added Vin ***
[10/20/2011 6:59:13 AM] Vin: cheers
[10/20/2011 8:14:30 AM] John Winter: ... not sure on the model / service approach
[10/20/2011 8:14:57 AM] John Winter: we're at kicking off time, i suspect it is still service approach
[10/20/2011 8:15:00 AM] Chris Summers: Well basically Peter has been working getting rid of the Services project
[10/20/2011 8:15:06 AM] Chris Summers: and using a model instead
[10/20/2011 8:15:09 AM] John Winter: ok
[10/20/2011 8:15:14 AM] John Winter: i'll have a look into it
[10/20/2011 8:15:28 AM] Chris Summers: It only happened in the last 24 hours
[10/20/2011 8:15:30 AM] Nuno Linhares: It seems that this is the way the CME handles it
[10/20/2011 8:15:43 AM] Nuno Linhares: so I would recommend blowing away your local copy and downloading it all again
[10/20/2011 8:15:50 AM] John Winter: mother fuckers
[10/20/2011 8:16:03 AM] John Winter: we got latest this morning
[10/20/2011 8:16:07 AM] Chris Summers: now now, this is a public group now
[10/20/2011 8:16:08 AM] Nuno Linhares: that should work then
[10/20/2011 8:16:18 AM] John Winter: (with respect)
[10/20/2011 8:16:20 AM] Nuno Linhares: I think Peter's changes were done last night
[10/20/2011 8:16:27 AM] John Winter: ah ok great
[10/20/2011 8:16:36 AM] Nuno Linhares: With all due respect, I do believe you're ****ing your mother?
[10/20/2011 8:16:52 AM] John Winter: yes!
[10/20/2011 8:17:17 AM] Vesa Paakkanen: there is only one reply to this: http://www.youtube.com/watch?v=X0DeIqJm4vM
[10/20/2011 8:18:19 AM] Nuno Linhares: OK, I'm going to be rather absent today, I'm about to start a conf-call marathon
[10/20/2011 8:18:29 AM] Nuno Linhares: so you guys go and fix everything, will you?
[10/20/2011 8:18:36 AM] Albert Romkes: :)
[10/20/2011 8:18:42 AM] Chris Summers: Me to, meetings this morning then flying hoime
[10/20/2011 8:19:12 AM] Nuno Linhares: @John: mighty gracious of you to get half of Content Bloom working on the Power Tools
[10/20/2011 8:19:28 AM] Nuno Linhares: you may want to start with the "Credits" Power Tool and put your name on top ;)
[10/20/2011 8:19:50 AM] Chris Summers: @John, yes I agree with Nuno, everyone (except me) is making a stellar effort
[10/20/2011 8:28:52 AM] John Winter: let's see if we produce anything first :)
[10/20/2011 10:16:00 AM] John Winter: Got the page publisher tool to a state where the core service code just needs to be written
[10/20/2011 10:16:48 AM] John Winter: the new model stuff is much easier to work with
[10/20/2011 10:17:13 AM] John Winter: nothings errors, it just isn't completed, should i be checking in at this point, or only when it's 100%?
[10/20/2011 10:17:36 AM] Peter Kjaer: I'd say check it in
[10/20/2011 10:17:46 AM] Peter Kjaer: best to do check-ins often, in my experience
[10/20/2011 10:18:22 AM] Peter Kjaer: you don't want to end up losing stuff, or needing to do a whole lot of merging
[10/20/2011 10:18:38 AM] John Winter: ok great
[10/20/2011 10:18:57 AM] Peter Kjaer: so as long as it doesn't break anything else, check it in whenever you feel like you've accomplished *something* (no matter how small)
[10/20/2011 10:27:23 AM] Nuno Linhares: it helps if you write _something_ in the comments when checking in ;)
[10/20/2011 10:27:34 AM] John Winter: i did
[10/20/2011 10:27:46 AM] Peter Kjaer: that's true, we should always do that so you can easily see what's going on
[10/20/2011 10:28:38 AM] John Winter: i'm a bit of a version control noob, which i know is a terrible thing to admit :)
[10/20/2011 10:29:00 AM] Peter Kjaer: hehe no problem, you'll be beaten into submission quickly enough
[10/20/2011 10:35:06 AM] John Winter: you're not wrong
[10/20/2011 10:35:35 AM] John Winter: i had copied the 'imageuploader' from the editor client, which contains a hidden svn directory... make sure you clean those out :)
[10/20/2011 10:36:59 AM] Peter Kjaer: yeah, that's something I had to remember too - having gotten used to TFS which keeps track of this on the server instead
[10/20/2011 11:06:18 AM] Albert Romkes: Nice work John. Just did a getlatest...
[10/20/2011 11:06:53 AM] John Winter: phew! - i've been hanging about waiting for someone to get it.
[10/20/2011 11:07:02 AM] Albert Romkes: I think checking didn't go as plannend. I got the files twice...
[10/20/2011 11:07:16 AM] Albert Romkes: Once in the ImageUploader dir and once in the Pagepublisher dir.
[10/20/2011 11:07:18 AM] John Winter: ah, damn, let me look
[10/20/2011 11:07:34 AM] Albert Romkes: I think you have to check in the Solution file as well...
[10/20/2011 11:07:48 AM] John Winter: ok
[10/20/2011 11:07:50 AM] Albert Romkes: I got the files when I did a getlatest, but they weren't included in my project.
[10/20/2011 11:09:16 AM] John Winter: just fixing it up now
[10/20/2011 11:09:27 AM] Peter Kjaer: from the check-in it looks like you might have changed the ImageUploader (due to the copying we talked about earlier)
[10/20/2011 11:09:53 AM] John Winter: anyone got a 'version control for dummies' book to hand?
[10/20/2011 11:10:01 AM] Peter Kjaer: hehe
[10/20/2011 11:10:08 AM] Peter Kjaer: no problem, I can roll it back
[10/20/2011 11:10:12 AM] John Winter: give me 5 mins and i'll get it fixed
[10/20/2011 11:10:30 AM] Peter Kjaer: oh actually, you didn't
[10/20/2011 11:10:42 AM] Peter Kjaer: it's just that the client files are in the ImageUploader directory
[10/20/2011 11:10:48 AM] Albert Romkes: Before checking anything in, it's a good practice to first do a getlatest
[10/20/2011 11:11:00 AM] Albert Romkes: always
[10/20/2011 11:11:15 AM] John Winter: sorry guys, lesson learnt
[10/20/2011 11:11:38 AM] Albert Romkes: Np
[10/20/2011 11:12:19 AM] Peter Kjaer: it's fine, I thought it was worse than that :) there's just a copy of the client-side files in the ImageUploader directory
[10/20/2011 11:12:28 AM] Albert Romkes: Yeah. No big deal.
[10/20/2011 11:13:06 AM] Peter Kjaer: nope - and like I said, even if we screw something up we can always roll it back :)
[10/20/2011 11:13:19 AM] John Winter: ive removed the files and performed a new commit
[10/20/2011 11:14:56 AM] Peter Kjaer: alright, I'll give it a spin
[10/20/2011 11:15:35 AM] John Winter: i had to do an svn 'clean' to make the folder have the green tick again - make sure you do the clean :)
[10/20/2011 11:15:45 AM] John Winter: (ruddy version tools)
[10/20/2011 11:17:09 AM] *** John Winter added Mark Williams ***
[10/20/2011 11:17:26 AM] Peter Kjaer: missing the .scv.cs file
[10/20/2011 11:17:48 AM] John Winter: .. guys let me add mark williams, he's working on the 'field remover'
[10/20/2011 11:17:56 AM] John Winter: ok, adding now
[10/20/2011 11:18:01 AM] Mark Williams: Hello everyone.
[10/20/2011 11:18:25 AM] Albert Romkes: Hi
[10/20/2011 11:18:29 AM] Peter Kjaer: hi Mark
[10/20/2011 11:19:23 AM] Mark Williams: Hi. I'm currently making a couple of nice icons for it.
[10/20/2011 11:19:36 AM] Peter Kjaer: awesome :)
[10/20/2011 11:19:51 AM] Peter Kjaer: John, I seem to be missing the web service files
[10/20/2011 11:20:03 AM] John Winter: doing it now
[10/20/2011 11:20:14 AM] Peter Kjaer: alrighty
[10/20/2011 11:20:18 AM] John Winter: this is my first time, we all sucked first time right?
[10/20/2011 11:20:30 AM] Peter Kjaer: hehe absolutely
[10/20/2011 11:21:23 AM] Peter Kjaer: did you see my failed check-ins yesterday? and I've used SVN plenty of times before. All it took was a little time with other versioning systems and I suddenly forgot all the pitfalls :)
[10/20/2011 11:21:59 AM] John Winter: ok svc files are in
[10/20/2011 11:24:03 AM] Peter Kjaer: alright, I can build and I see the toolbar button which opens up the window
[10/20/2011 11:24:24 AM] Albert Romkes: Should the svc also be referenced in the web.config?
[10/20/2011 11:24:38 AM] Albert Romkes: (from the Model project)
[10/20/2011 11:24:40 AM] Peter Kjaer: yeah, otherwise the service won't work
[10/20/2011 11:24:49 AM] Albert Romkes: :)
[10/20/2011 11:25:06 AM] John Winter: you guys are breaking my balls :)
[10/20/2011 11:25:09 AM] Peter Kjaer: it should also be added to Model.config so you get the proxy object generated
[10/20/2011 11:25:38 AM] John Winter: I  get you
[10/20/2011 11:25:48 AM] Albert Romkes: ah. Ok. Learned something.
[10/20/2011 11:25:51 AM] Peter Kjaer: but yeah, this looks like a promising start
[10/20/2011 11:25:56 AM] Peter Kjaer: good work, guys :)
[10/20/2011 11:26:27 AM] John Winter: thanks, the other guys here have made similar progress on their tools - i.e we've managed to copy and rename the image uploader !
[10/20/2011 11:27:07 AM] Peter Kjaer: well, as you can see even that is an accomplishment - what with all the steps you need to do :)
[10/20/2011 11:27:32 AM] John Winter: yeah it is, i've got an image to appear in the gui, i feel like a king
[10/20/2011 11:27:57 AM] Nuno Linhares: you ARE a king John
[10/20/2011 11:28:23 AM] John Winter: haha
[10/20/2011 11:29:06 AM] Albert Romkes: Peter, the Execute method from the ImageUploader has 3 parameters...
[10/20/2011 11:29:24 AM] Albert Romkes: But the Javascript call has 7 parameters....
[10/20/2011 11:29:31 AM] Peter Kjaer: yeah
[10/20/2011 11:29:33 AM] Albert Romkes: What am I missing? :)
[10/20/2011 11:29:56 AM] Peter Kjaer: well, all of the proxy methods have additional parameters added to them
[10/20/2011 11:30:08 AM] Albert Romkes: By Tridion? Or .NET?
[10/20/2011 11:31:05 AM] Peter Kjaer: let's see if I can remember them off the top of my head: callback function for successful completion, callback for failure, user context (allowing you to pass information to the callback that is not in the response), and whether or not it should be a synchronous call (at least I assume that's what "sync" means, I've never set it to true)
[10/20/2011 11:31:33 AM] Peter Kjaer: I think by Tridion, but I honestly don't know how exactly that works
[10/20/2011 11:31:43 AM] Nuno Linhares: voodoo
[10/20/2011 11:32:11 AM] Albert Romkes: Magic.
[10/20/2011 11:32:12 AM] Peter Kjaer: if you really want to know, I've got the source code so I can find out. So far I've been content with it just working
[10/20/2011 11:32:19 AM] Albert Romkes: hahahaha
[10/20/2011 11:32:44 AM] Albert Romkes: Thanks.... but I can decomple the Tridion.UI.Core.dll right?
[10/20/2011 11:32:46 AM] Albert Romkes: :)
[10/20/2011 11:33:29 AM] Peter Kjaer: sure, go ahead. Knock yourself out :)
[10/20/2011 11:36:51 AM] John Winter: any idea why the icons for the example and image uploader appear twice?
[10/20/2011 11:37:00 AM] John Winter: magic too?
[10/20/2011 11:37:15 AM] Peter Kjaer: huh? I didn't see anything like that
[10/20/2011 11:37:18 AM] Peter Kjaer: did you clear your browser cache?
[10/20/2011 11:37:28 AM] Nuno Linhares: I don't have that either
[10/20/2011 11:38:17 AM] John Winter: the three of us here have it, even after cleaning cache
[10/20/2011 11:38:23 AM] John Winter: must me something local to our machines
[10/20/2011 11:38:30 AM] John Winter: me = be
[10/20/2011 11:39:24 AM] Peter Kjaer: are there 2 of each button, or is it more like the button appears both enabled and disabled? or something completely different?
[10/20/2011 11:39:39 AM] Frank van Puffelen: @Peter: I've recently used the sync=true in a web service call. I called it from an event handler and needed to pass the result on to the next handler. :)
[10/20/2011 11:39:50 AM] John Winter: two of each button
[10/20/2011 11:40:30 AM] Peter Kjaer: there you have it, folks: confirmation that the last parameter is to make the call synchronous :)
[10/20/2011 11:40:50 AM] Frank van Puffelen: But you typically should not do that. It's very un-AJAX-y to do so.
[10/20/2011 11:40:53 AM] Peter Kjaer: okay - maybe you want to check your editor.config file for duplicates?
[10/20/2011 11:41:40 AM] John Winter: will do
[10/20/2011 11:44:03 AM] John Winter: it was another gui called 'schema tab'
[10/20/2011 11:44:19 AM] John Winter: that i nicked off Mr Summers, that also had those items in there :)
[10/20/2011 11:44:43 AM] Albert Romkes: Again...Chris....
[10/20/2011 11:44:56 AM] John Winter: Let's get him!
[10/20/2011 11:46:04 AM] Peter Kjaer: hehe
[10/20/2011 12:23:46 PM] Mark Williams: Can anyone here add me as a contributor to the project? I've emailed Alvin but haven't heard anything back.
[10/20/2011 12:26:52 PM] *** John Winter added Mark Saunders ***
[10/20/2011 12:27:27 PM] John Winter: Mark[] myMarks = new Mark { Mark Williams, Mark Saunders };
[10/20/2011 12:27:51 PM] Mark Williams: Well done John
[10/20/2011 12:27:56 PM] Peter Kjaer: hehe
[10/20/2011 12:28:00 PM] Mark Saunders: Mark [2] alias Dylan
[10/20/2011 12:28:25 PM] Alvin Reyes: Did I get everyone?
[10/20/2011 12:28:25 PM] Peter Kjaer: Hello to you too :)
[10/20/2011 12:28:50 PM] Alvin Reyes: http://code.google.com/p/tridion-2011-power-tools/people/list
[10/20/2011 12:29:02 PM] Mark Williams: Aha, thanks
[10/20/2011 12:29:09 PM] Alvin Reyes: cheers
[10/20/2011 12:29:43 PM] Mark Saunders: Hi guys, took 45 minutes for a crappy icon. Don't hold your breath to be marking items as published from a context menu for too long ;)
[10/20/2011 12:30:54 PM] Alvin Reyes: 45 minutes to figure something out and help future devs is both much appreciated and I think well spent :)
[10/20/2011 12:31:20 PM] Frank van Puffelen: That actually sounds threateningly fast. :-/
[10/20/2011 12:31:36 PM] Alvin Reyes: no Peter, Albert, Chris, Nuno, and the cheering crowds (including Frank) don't have to do all the work
[10/20/2011 12:31:39 PM] Alvin Reyes: *now
[10/20/2011 12:32:01 PM] Frank van Puffelen: @Mark: you moved on to #4 way too fast! ;)
[10/20/2011 12:32:16 PM] Mark Saunders: hit a snake... back at 3!
[10/20/2011 12:33:12 PM] Nuno Linhares: cool, I'm starting a new language trend. How are you? Oh, I'm 5 today!
[10/20/2011 12:33:15 PM] Frank van Puffelen: Frank van Puffelen hides...
[10/20/2011 12:33:42 PM] Alvin Reyes: where's my international time calculator...
[10/20/2011 12:33:53 PM] Alvin Reyes: oh wait, that's not time
[10/20/2011 12:33:59 PM] Alvin Reyes: that's the STAGES of Tridion
[10/20/2011 12:34:32 PM] Alvin Reyes: http://nunolinhares.blogspot.com/2011/10/you-think-you-got-what-it-takes.html
[10/20/2011 12:34:56 PM] Alvin Reyes: let me tweet that real quick
[10/20/2011 12:36:55 PM] Alvin Reyes: done! ;)
[10/20/2011 12:37:36 PM] Nuno Linhares: there's actually 6... but I guess 1 & 6 are similar in feeling
[10/20/2011 12:40:18 PM] Alvin Reyes: i needed a good hook http://en.wikipedia.org/wiki/Grief#Five_stages_theory
[10/20/2011 12:40:50 PM] Alvin Reyes: 6 could be the "Rinse. Lather. Repeat" step :)
[10/20/2011 12:46:19 PM] John Winter: 7. Sit back and watch the resulting disaster
[10/20/2011 12:46:46 PM] Alvin Reyes: 8. put it on the wiki
[10/20/2011 2:03:47 PM] Albert Romkes: Ok. Just checked in the first version of the itemselector.
[10/20/2011 2:04:12 PM] Albert Romkes: You can see it in the  'Example' powertool from Chris...
[10/20/2011 2:04:19 PM] Nuno Linhares: NICE
[10/20/2011 2:04:52 PM] Albert Romkes: Just hit the button 'Itemselector' and the Tridion itemselector popup shows up. You can only select components and component templates. (but you can change that of course)
[10/20/2011 2:05:34 PM] Albert Romkes: After selecting, the selected URI is shown next to the itemselector-button.
[10/20/2011 2:10:55 PM] Chris Summers: I have to stop going of line, get blamed for so much $@#T when I leave this thing
[10/20/2011 2:11:18 PM] Chris Summers: Delays in Philly, so I will download the latest and stary playing
[10/20/2011 2:11:28 PM] Chris Summers: be prepared for over simplified disaster questions
[10/20/2011 2:12:00 PM] Albert Romkes: haha... I just felt back into stage 2... :(
[10/20/2011 2:12:31 PM] Nuno Linhares: hehe, no worries, phase 3 is always the worst!
[10/20/2011 2:17:41 PM] Frank van Puffelen: I just had one of those setbacks: my OME initiatives were not showing the correct icon. Many code and System.config changes made no difference, because of course it needed an IIS reset and browser restart. I'm shutteling between phase 2 and 4 now. :-/
[10/20/2011 2:22:13 PM] Alvin Reyes: would something like this help development, at least on the client side:
http://www.catonmat.net/blog/clear-privacy-ie-firefox-opera-chrome-safari/
[10/20/2011 2:24:20 PM] Frank van Puffelen: In most browser the clear cache is relatively close by (ctrl-shift-Del in Chrome). It's more a selective clear (this domain only) or a "do not use cache now" that are really helpful.
[10/20/2011 2:24:30 PM] Chris Summers: OK, pehaps someone can help me here, when adding a model does it need a vdir?
[10/20/2011 2:24:48 PM] Chris Summers: IN the latest code it looks like it has the same vdir as the editor
[10/20/2011 2:25:00 PM] Frank van Puffelen: Yes, a model needs a vdir too.
[10/20/2011 2:25:26 PM] Frank van Puffelen: The name of the vdir can be the same between model and editor as they go into a different location in IIS.
[10/20/2011 2:25:45 PM] Chris Summers: O, that makes sense
[10/20/2011 2:25:54 PM] Chris Summers: Thanks for the clarification
[10/20/2011 2:25:57 PM] Frank van Puffelen: You sound surprised. ;)
[10/20/2011 2:26:48 PM] Frank van Puffelen: If you look in IIS under WebUI\Models and WebUI\Editors you see that both have a CME vdir under them.
[10/20/2011 2:26:59 PM] Frank van Puffelen: That way you know the two belong together.
[10/20/2011 2:27:15 PM] Frank van Puffelen: And it's less typing than CMEModel and CMEEditor. :)
[10/20/2011 2:28:10 PM] Chris Summers: Not suprised
[10/20/2011 2:28:27 PM] Chris Summers: Just needed to have my head cleared
[10/20/2011 2:28:32 PM] Chris Summers: No sarcasm meant
[10/20/2011 2:28:38 PM] Chris Summers: It really does make sense
[10/20/2011 2:29:18 PM] Frank van Puffelen: Yup. Peter's cleanup seems to have resulted in a nice and clean codebase from what I hear.
[10/20/2011 2:29:29 PM] Chris Summers: Think I am making a short pit stop in phase 5
[10/20/2011 2:29:53 PM] Chris Summers: If only he had started this project instead on me an Yoav
[10/20/2011 2:30:52 PM] Frank van Puffelen: If you guys hadn't started we'd probably still have nothing.
All's well that ends well.
[10/20/2011 2:31:06 PM] Alvin Reyes: sometimes it just takes a nudge or good question
[10/20/2011 2:32:20 PM] Chris Summers: I am full of nudges
[10/20/2011 2:32:28 PM] Alvin Reyes: we appreciate "Urban Cherry" for bringing the idea to the community
[10/20/2011 2:32:32 PM] Chris Summers: I wish those existed for Skype
[10/20/2011 2:32:45 PM] Chris Summers: Thankls @Alvin
[10/20/2011 2:33:04 PM] Chris Summers: now I better strt contributing so I can get an MVP next year
[10/20/2011 2:33:16 PM] Chris Summers: All these contributions are great, but showing me up
[10/20/2011 2:33:28 PM] Alvin Reyes: :)
[10/20/2011 2:33:55 PM] Alvin Reyes: I think the biggest "win" is the newer contributors (no pressure).
[10/20/2011 2:34:17 PM] Chris Summers: While there are a bunch of clever people online: Has anyone built a solution for publishing an entire (static HTML site) from a zip fil created by an agency?
[10/20/2011 2:34:25 PM] Nuno Linhares: if bringing ideas would give people an MVP, we'd have loads of MVPs out there! Chris has done quite a lot more than bringing an idea, and I think he's pretty proud of what you guys are doing with it
[10/20/2011 2:34:46 PM] Chris Summers: I am very proud of yopu all
[10/20/2011 2:34:50 PM] Nuno Linhares: @Chris: Event System, WebDav drag-and-drop is the best I did
[10/20/2011 2:35:49 PM] Chris Summers: I was thinking of making a template that can extract all the files from a zip file, and publish them with tghe same structure. This is for small microsites that are developed externally
[10/20/2011 2:36:18 PM] Nuno Linhares: I guess that would be relatively easy to do from a zip... maintaining structure is the hardest part
[10/20/2011 2:36:30 PM] Chris Summers: Not really CM stuff, more microsite deployment
[10/20/2011 2:36:35 PM] Nuno Linhares: since you need the SG to exist if you want to publish to it
[10/20/2011 2:36:44 PM] Nuno Linhares: maybe not with variants... hmmm
[10/20/2011 2:37:10 PM] Alvin Reyes: @Nuno definitely, but I wanted to say thanks specifically for getting us a great MVP retreat "idea" (beyond the volunteer work he's put into it)
[10/20/2011 2:37:28 PM] Nuno Linhares: no, you still need the target SG to exist, even with variants :(
[10/20/2011 2:37:42 PM] Chris Summers: I was thinking of making a pub called microsites, and then making a SG for each new site, and making 1 page which you put the zip on, then every element in the zip will be published as a variant of the zip file. That way the whole site can be deployed or undeployed
[10/20/2011 2:37:44 PM] Nuno Linhares: deployer extension... but that's in the "other side"
[10/20/2011 2:37:58 PM] Chris Summers: I would then make all the SG's at publish time
[10/20/2011 2:38:26 PM] Nuno Linhares: yup, and use CoreService so you don't need to change your templates to be read/write ;)
[10/20/2011 2:38:34 PM | Edited 2:38:40 PM] Frank van Puffelen: Guys, is that really a PowerTools discussion?
[10/20/2011 2:38:43 PM] Vin: The static fies from zip can be read.. but while publish... the presentation can be maintained as "Static" ( not too much of presentation )... and guess  lift_shift  method could be used ( not great but being static )
[10/20/2011 2:38:49 PM] Chris Summers: It's not a  power tools discussion
[10/20/2011 2:38:58 PM] Nuno Linhares: true
[10/20/2011 2:39:00 PM] Alvin Reyes: (but we're building community)
[10/20/2011 2:39:01 PM] Nuno Linhares: boooh on Frank
[10/20/2011 2:39:06 PM] Chris Summers: But we don't have a "Let's dicuss Chri's problems" channel
[10/20/2011 2:39:27 PM] Nuno Linhares: we do now
[10/20/2011 2:39:32 PM] Chris Summers: ;)
[10/20/2011 2:39:50 PM] Chris Summers: Feel free to ignore me Frank
[10/20/2011 2:40:01 PM] Chris Summers: I know this is to much like implemntation for u
[10/20/2011 2:40:26 PM] Nuno Linhares: and while we're off topic, I just had a phase 6 moment! I'm basking in it! It will last for DAYS!
[10/20/2011 2:40:49 PM] Alvin Reyes: gratz!
[10/20/2011 2:44:08 PM] Chris Summers: So do you like my micro site solution Nuno, or do you have a superior idea
[10/20/2011 2:44:09 PM] Chris Summers: ?
[10/20/2011 2:45:53 PM] Albert Romkes: Chris, why not make it a custompage? Users select zip, custompage makes the sg's and pages and publishes the site...
[10/20/2011 2:46:42 PM] Chris Summers: I guess I wonder why make a Custom page, that's just an extra step
[10/20/2011 2:46:53 PM] Chris Summers: A template can do all the same stuff using core service
[10/20/2011 2:47:07 PM] Chris Summers: That way the Zip is just a MM Comp
[10/20/2011 2:47:14 PM] Albert Romkes: Yep. Is there no configuration to be done by the editors?
[10/20/2011 2:47:51 PM] Chris Summers: Well it's really just an idea, and I would like to make it useful to anyone else
[10/20/2011 2:47:58 PM] Alvin Reyes: would pages still have CPs or are they the MM components... and what if 3rd-party's html is invalid?
[10/20/2011 2:48:02 PM] Chris Summers: So I am interested if anyone would find it useful
[10/20/2011 2:48:23 PM] Chris Summers: I was thinking I would not build pages at all
[10/20/2011 2:48:48 PM] Chris Summers: The idea is that we get prepackaged sites (and eventually WAR files) which need to be deployed as is
[10/20/2011 2:49:00 PM] Chris Summers: We just want to use the CMS as a way of deploying them
[10/20/2011 2:49:23 PM] Alvin Reyes: editors and developers are a stubborn lot (based on my jaded experience and present company excluded), so I say useful yes, but only if those users "accept" Tridion first
[10/20/2011 2:49:24 PM] Chris Summers: Really doing little more than FTP, but we have a workflow and approval on the package as a whole
[10/20/2011 2:50:29 PM] Chris Summers: It could eventually be used for deploying an application which consumes CMS content also
[10/20/2011 2:50:56 PM] Chris Summers: BUt from a testing perspective, it is much nicer to deploy a tested package than a bunch of fragmented files
[10/20/2011 2:51:06 PM] Nuno Linhares: Sorry, was out
[10/20/2011 2:51:17 PM] Chris Summers: Could easily be a deployer extention, but I don't remember how to write those
[10/20/2011 2:51:34 PM] Alvin Reyes: I once suggested putting a company "holiday greeting" microsite (2 pages with Flash) in Tridion. No traction, but that could have been my lack of charm and/or tact.
[10/20/2011 2:51:35 PM] Nuno Linhares: I like the idea, and frankly this is something that comes up a lot: we just need a way to push these files to the server, making Tridion a really expensive FTP client
[10/20/2011 2:52:16 PM] Nuno Linhares: if it's malformed, send it back to the agency
[10/20/2011 2:52:38 PM] Chris Summers: Well I guess that is the idea exactly. You could uild a small HTML site with no Tridion skills, zip it up and drop it in the CMS to deploy it
[10/20/2011 2:53:10 PM] Chris Summers: As for malformed, I don't really care, all the agency has to do is send us a new zip
[10/20/2011 2:53:23 PM] Chris Summers: and Tridion manages all the dependencies as variants
[10/20/2011 2:53:38 PM] Alvin Reyes: useful, flexible, and powerful! (but how to keep people from abusing it?)
[10/20/2011 2:53:42 PM] Nuno Linhares: the "problem" is when they want to control consistency with Tridion from there, customers don't really understand what's involved in Tridion-izing html, and then they go crazy with the requirements and cost...
[10/20/2011 2:53:50 PM] Chris Summers: I say let people abuse themselves
[10/20/2011 2:53:52 PM] Nuno Linhares: Had this recently with a customer...
[10/20/2011 2:54:16 PM] Nuno Linhares: anyway, going back to my conf-call marathon... one more to go! And that's 4 customers in one day
[10/20/2011 2:54:42 PM] Chris Summers: OK, thanks for the input. Think I will build it in my delay at DTW tonight
[10/20/2011 2:55:17 PM] Alvin Reyes: cool, a new power tool ;)
[10/20/2011 2:55:32 PM] Chris Summers: Well new community contribution
[10/20/2011 2:55:56 PM] Alvin Reyes: I'll start a page :)
[10/20/2011 2:56:02 PM] Chris Summers: Nooooooooooooooooooooo
[10/20/2011 2:56:09 PM] Nuno Linhares: I'll look around, I wrote some zip/unzip stuff some time ago with some open source library to handle it
[10/20/2011 2:56:30 PM] Nuno Linhares: it was pretty straightforward
[10/20/2011 2:56:38 PM] Chris Summers: i have one, no worries
[10/20/2011 2:56:42 PM] Nuno Linhares: k
[10/20/2011 2:56:48 PM] Chris Summers: thanks though
[10/20/2011 6:14:28 PM] Chris Summers: Anyone still out there?
[10/20/2011 6:14:43 PM] Frank van Puffelen: Always Chris, you should know that. ;)
[10/20/2011 6:14:49 PM] Chris Summers: :)
[10/20/2011 6:15:20 PM] Mihai Cadariu: yes.. did you land? :)
[10/20/2011 6:15:31 PM] Alvin Reyes: semi-here
[10/20/2011 6:15:33 PM] Chris Summers: Any good reason why the name for the model in the system.config is Tridion.PowerTools.UI.Model and the editor is just PowerTools2011 in the fragments?
[10/20/2011 6:15:50 PM] Chris Summers: Seems like we should make them consistent
[10/20/2011 6:16:09 PM] Frank van Puffelen: Please remove the version number from the name. At least, that's what I would do.
[10/20/2011 6:16:24 PM] Chris Summers: You mean the 2011 bit?
[10/20/2011 6:16:41 PM] Mihai Cadariu: yup
[10/20/2011 6:16:48 PM] Frank van Puffelen: Yup. It's outdated before it hits the streets.
[10/20/2011 6:17:02 PM] Chris Summers: Seems like it should be Tridion.PowerTools.UI.Model and Tridion.PowerTools.UI.Editor
[10/20/2011 6:17:06 PM] Frank van Puffelen: You can version your releases, but don't put release numbers in class names.
[10/20/2011 6:17:17 PM] Frank van Puffelen: Or in WCF binding names. ;)
[10/20/2011 6:17:20 PM] Chris Summers: Are those really class names?
[10/20/2011 6:17:26 PM] Mihai Cadariu: CoreService-style
[10/20/2011 6:18:24 PM] Chris Summers: @mihai: you lost me
[10/20/2011 6:18:38 PM] Frank van Puffelen: The Core Service has 2010 in its binding name.
[10/20/2011 6:18:46 PM] Chris Summers: OK, yes, that sucks
[10/20/2011 6:18:56 PM] Frank van Puffelen: Which in their case is actually a lucky coincidence, because they can now version those end points.
[10/20/2011 6:18:57 PM] Chris Summers: But this is just a name right?
[10/20/2011 6:19:12 PM] Frank van Puffelen: That name gets compiled into all kinds of proxies when you connect.
[10/20/2011 6:19:19 PM] Frank van Puffelen: ICoreService2010 :)
[10/20/2011 6:19:24 PM] Chris Summers: OK, so it's good to fix it now
[10/20/2011 6:19:33 PM] Chris Summers: I am ignoring core service
[10/20/2011 6:19:48 PM] Frank van Puffelen: Yup. We can call the project PowerTools 2011, but the code should not refer to a version numbers.
[10/20/2011 6:19:53 PM] Chris Summers: it's the names for the editors and models in the powertools code I am concerned about
[10/20/2011 6:20:00 PM] Frank van Puffelen: Core Service is not as bad as people say, once you get used to it.
[10/20/2011 6:20:12 PM] Chris Summers: e.g.
<editor name="Tridion.PowerTools.UI.Editor" xmlns="http://www.sdltridion.com/2009/GUI/Configuration">
 <installpath>C:\Dropbox\DEV\Power Tools 2011\Development\trunk\PowerTools2011 - Editor\</installpath>
 <configuration>Configuration\Editor.config</configuration>
 <vdir>PowerTools2011</vdir>
</editor>
[10/20/2011 6:20:17 PM] Frank van Puffelen: And it's extremely fun to have a client run locally and connect to all kinds of remote Tridion systems. :)
[10/20/2011 6:20:39 PM] Chris Summers: Should the Model and Editor be consistent?
[10/20/2011 6:20:47 PM] Chris Summers: where else is this name used?
[10/20/2011 6:21:32 PM] Nuno Linhares: I don't know
[10/20/2011 6:21:40 PM] Nuno Linhares: See Peter's post on namespaces for guidance maybe?
[10/20/2011 6:21:41 PM] Nuno Linhares: http://groups.google.com/group/tridion-powertools/browse_thread/thread/9a879aeb338ce938
[10/20/2011 6:21:46 PM] Frank van Puffelen: I would keep them consistent yes.
[10/20/2011 6:22:02 PM] John Winter: @chris - why not unzip it and ftp it to your clients server and not bother with tridion :)
[10/20/2011 6:22:10 PM] Chris Summers: It's not really a namespace though is it?
[10/20/2011 6:22:43 PM] Chris Summers: @john, are you back on the old subject of my microsite stuff
[10/20/2011 6:22:45 PM] Nuno Linhares: Consistency would probably be a good idea... and when it comes to Anguilla I make no assumptions about anything anymore
[10/20/2011 6:23:03 PM] John Winter: sorry all these just popped up, i thought i was being 'current'
[10/20/2011 6:23:50 PM] Chris Summers: Nope, and if I could FTPO I would, but that was about the 120 agencies who build shil for my client being able to deply mini sites to potentially hundreds of servers
[10/20/2011 6:24:07 PM] John Winter: rsync ?
[10/20/2011 6:24:31 PM] Chris Summers: OK, back to the POWERTOOLS John
[10/20/2011 6:24:38 PM] John Winter: :)
[10/20/2011 6:24:44 PM] Chris Summers: Ipromise not to bring up non PT stuff here ever again
[10/20/2011 6:24:49 PM] Chris Summers: Anyway
[10/20/2011 6:25:08 PM] Chris Summers: Looking at the system.config, most of the Editor and Model names are a single word
[10/20/2011 6:25:21 PM] Chris Summers: Do they get used in creating NAmes in the UI
[10/20/2011 6:25:21 PM] Nuno Linhares: PTEditor, PTModel
[10/20/2011 6:25:23 PM] Nuno Linhares: ?
[10/20/2011 6:25:27 PM] Chris Summers: The Gui is CMS
[10/20/2011 6:25:30 PM] Nuno Linhares: PowerTools
[10/20/2011 6:25:41 PM] Chris Summers: and the R5.4 stuff is TCM54
[10/20/2011 6:25:51 PM] Nuno Linhares: OK, remove the 2011
[10/20/2011 6:26:07 PM] Chris Summers: I think it should be PowerTools not Tridion.PowerTools.UI.Editor or Tridion.PowerTools.UI.Model
[10/20/2011 6:26:21 PM] Alvin Reyes: i think we chose that yes
[10/20/2011 6:26:31 PM] Nuno Linhares: That's just the name in IIS, right? The Virtual Directory
[10/20/2011 6:26:42 PM] Chris Summers: No, there is a VDIR also
[10/20/2011 6:26:51 PM] Nuno Linhares: Right, just saw it again.
[10/20/2011 6:26:54 PM] Nuno Linhares: Yes, PowerTools
[10/20/2011 6:27:02 PM] Chris Summers: Look at this:
[10/20/2011 6:27:03 PM] Chris Summers:     <editor name="PowerTools2011" xmlns="http://www.sdltridion.com/2009/GUI/Configuration">
      <installpath xmlns="http://www.sdltridion.com/2009/GUI/Configuration">C:\Projects\PowerTools\PowerTools2011 - Editor\</installpath>
      <configuration xmlns="http://www.sdltridion.com/2009/GUI/Configuration">Configuration\editor.config</configuration>
      <vdir xmlns="http://www.sdltridion.com/2009/GUI/Configuration">PowerTools2011</vdir>
    </editor>
    
  </editors>
  <!--  Models settings. -->
  <models>
    <model name="TCM54" xmlns="http://www.sdltridion.com/2009/GUI/Configuration">
      <installpath xmlns="http://www.sdltridion.com/2009/GUI/Configuration">C:\Program Files (x86)\Tridion\web\WebUI\Models\TCM54\</installpath>
      <configuration xmlns="http://www.sdltridion.com/2009/GUI/Configuration">Configuration\TCM54.config</configuration>
      <vdir xmlns="http://www.sdltridion.com/2009/GUI/Configuration">TCM54</vdir>
    </model>
    <model name="CME" xmlns="http://www.sdltridion.com/2009/GUI/Configuration">
      <installpath xmlns="http://www.sdltridion.com/2009/GUI/Configuration">C:\Program Files (x86)\Tridion\web\WebUI\Models\CME\</installpath>
      <configuration xmlns="http://www.sdltridion.com/2009/GUI/Configuration">Configuration\CMEModel.config</configuration>
      <vdir xmlns="http://www.sdltridion.com/2009/GUI/Configuration">CME</vdir>
    </model>
    <model name="Tridion.PowerTools.UI.Model">
      <installpath>C:\Projects\PowerTools\PowerTools2011 - Model\PowerTools2011 - Model</installpath>
      <configuration>Configuration\Model.config</configuration>
      <vdir>PowerTools2011</vdir>
    </model>
[10/20/2011 6:27:08 PM] Chris Summers: oh
[10/20/2011 6:27:12 PM] Chris Summers: that's ugly
[10/20/2011 6:27:25 PM] Chris Summers: The model and the Editor use very different formats
[10/20/2011 6:29:19 PM] Alvin Reyes: Would/should these match the suggested namespaces?
[10/20/2011 6:29:32 PM] Chris Summers: Well I think they should match the vdir name
[10/20/2011 6:31:03 PM] Alvin Reyes: yes, consitency is good
[10/20/2011 6:32:00 PM] Alvin Reyes: (unless there's a reason not to be)
[10/20/2011 6:32:58 PM] Mihai Cadariu: @Alvin: lol
[10/20/2011 6:34:01 PM] Alvin Reyes: I'm working on my MVP of witty remarks next
[10/20/2011 6:35:13 PM] Chris Summers: OK, I am chaqngingf the name, and commiting it. If it break, others will fix it
[10/20/2011 6:37:55 PM] Chris Summers: Committed
[10/20/2011 6:40:02 PM] Alvin Reyes: I'm sure someone will catch it.
[10/20/2011 6:40:37 PM] Alvin Reyes: consider adding the point on the forum (or via email)
[10/20/2011 6:40:42 PM] Alvin Reyes: http://groups.google.com/group/tridion-powertools/browse_thread/thread/9a879aeb338ce938
[10/20/2011 6:47:31 PM] Chris Summers: done
[10/20/2011 6:49:39 PM] Alvin Reyes: cool, thanks!
[10/20/2011 7:01:13 PM] Chris Summers: And I even just wrote a mini blog about the powertools
[10/20/2011 7:01:25 PM] Chris Summers: how is that for enthusiastic ;)
[10/20/2011 7:01:37 PM] Mark Williams: Cool. Do you have a link?
[10/20/2011 7:01:52 PM] Chris Summers: Don't get ecited: http://www.urbancherry.net/blogengine/
[10/20/2011 7:02:16 PM] Chris Summers: First one in over a year
[10/20/2011 7:02:25 PM] Mark Williams: haha, I like this stuff, I'm currently reading through Nuno's blog
[10/20/2011 7:02:36 PM] Chris Summers: He is a lot better than I am
[10/20/2011 7:02:47 PM] Chris Summers: which is amazing given how busy he is
[10/20/2011 7:03:04 PM] Chris Summers: Where are you based MArk?
[10/20/2011 7:03:11 PM] Mark Williams: All Tridion devs are non stop I think, I don't know how anyone has time for anything
[10/20/2011 7:03:33 PM] Mark Williams: I'm based in Leeds, UK. Currently at the Winter residence in Brussels though
[10/20/2011 7:03:36 PM] Chris Summers: I have lot's of time, I just prefer sleeping to blogging
[10/20/2011 7:03:47 PM] Mark Williams: haha
[10/20/2011 7:04:40 PM] Chris Summers: John was the only one who ever really responded to this: http://www.urbancherry.net/blogengine/post/2010/10/03/Can-crowd-sourcing-work-for-SDL-Tridion-Community-extensions.aspx so I gave up after that
[10/20/2011 7:04:50 PM] Mihai Cadariu: so that's why you can work on the Powertools... i'm litterally choked with work :(
[10/20/2011 7:05:26 PM] Chris Summers: @mihai, the urbancherry life style is a lot more friendly to downtime than SDL
[10/20/2011 7:05:42 PM] Mark Williams: I'll have a read through, I've just started with Content Bloom. I'm down for helping out on these PowerTools.
[10/20/2011 7:06:24 PM] Mihai Cadariu: are you hiring? :D
[10/20/2011 7:06:55 PM] Mihai Cadariu: what is content bloom? sorry my ignorance
[10/20/2011 7:07:23 PM] Chris Summers: Oh mihai, get with the times
[10/20/2011 7:07:31 PM] Chris Summers: UrbanCherry is....
[10/20/2011 7:07:51 PM] Mihai Cadariu: yeah... too busy keeping up...
[10/20/2011 7:08:17 PM] Chris Summers: ContentBloom is John Winter (MVP) and someone elses creation
[10/20/2011 7:08:18 PM] Mark Williams: Content Bloom is John's company
[10/20/2011 7:08:25 PM] Chris Summers: UrbanCherry with aspirations of groth
[10/20/2011 7:08:35 PM] Mihai Cadariu: :)
[10/20/2011 7:08:36 PM] Chris Summers: growth even
[10/20/2011 7:08:57 PM] Chris Summers: I sleep, while John sweats about paying employees
[10/20/2011 7:09:04 PM] Mark Williams: Haha
[10/20/2011 7:09:22 PM] Mark Williams: Sorry, I'm taking the discussion away from PowerTools...
[10/20/2011 7:09:25 PM] Mihai Cadariu: lol isee
[10/20/2011 7:11:48 PM] Alvin Reyes: @puf hasn't said anything yet :)
[10/20/2011 7:13:44 PM] Alvin Reyes: (UrbanCherry is the Alan Weiss of Tridion)
[10/20/2011 7:14:14 PM] Alvin Reyes: big link:
http://books.google.com/books?id=Pxx5knnbhR8C&pg=PA31&lpg=PA31&dq=alan+weiss+solo+versus+firm&source=bl&ots=OyUdQUlP2g&sig=G_ADHR9mtw8v7FK1WrUpfU2lCTc&hl=en&ei=66qgTujfPMeesQLbrrjABQ&sa=X&oi=book_result&ct=result&resnum=1&ved=0CBoQ6AEwAA#v=onepage&q&f=false
[10/20/2011 7:14:45 PM] Mark Williams: Ah, wow. I need to have a read of that
[10/20/2011 7:16:32 PM] Chris Summers: Yup, that's me
[10/20/2011 7:18:01 PM] Chris Summers: I ran a consulting firm before, an Nuno always said I was the worst boss ever, so not doing that again
[10/20/2011 7:19:08 PM] Chris Summers: OK, time to try and catch another flight
[10/20/2011 7:19:21 PM] Chris Summers: respectfy of you for the next 12 hours
[10/20/2011 7:19:27 PM] Alvin Reyes: (bad boss or not, Chris is a great trainer... got me started on my first schema)
[10/20/2011 7:19:35 PM] Alvin Reyes: safe flight!
[10/20/2011 7:19:50 PM] Chris Summers: Thanks all, code/sleep well
[10/20/2011 7:20:49 PM] Mihai Cadariu: ta da
[10/20/2011 7:21:06 PM] Mark Williams: Im off too, see you.
[10/20/2011 7:41:56 PM] Frank van Puffelen: Get back to PowerTools talk you lot!!! No slacking on social stuff! (angry)
[10/20/2011 7:42:02 PM] Frank van Puffelen: ;)
[10/20/2011 7:42:23 PM] Frank van Puffelen: Only 30 minutes late, almost like a Tridion Publisher. ;)
[10/20/2011 7:57:43 PM] Alvin Reyes: yes, but we're working on different threads (see productivity here: http://groups.google.com/group/tridion-powertools)
[10/20/2011 7:58:06 PM] Alvin Reyes: and here: http://www.createandbreak.net/2011/10/tridion-schema-change.html
[10/20/2011 7:58:34 PM] Alvin Reyes: (all while officially following the "setup a VM" guide)
[10/20/2011 7:59:56 PM] Alvin Reyes: ...and here: http://code.google.com/p/tridion-2011-power-tools/updates/list
[10/20/2011 8:21:40 PM] Alvin Reyes: and poof I'm gone for now (ninja)
[5:07:55 AM] Peter Kjaer: cool - a lot of checkins yesterday :)
[5:09:06 AM] Albert Romkes: Yeah... nice
[5:50:41 AM] Angel Puntero: Hello everybody
[5:52:09 AM] Albert Romkes: mornng
[5:52:51 AM] Angel Puntero: I can see a lot of new power tools in my ribbon bar :D
[5:54:11 AM] Albert Romkes: Yep. Lots of contributions :)
[6:00:04 AM] Peter Kjaer: morning Angel :)
[6:00:51 AM] Peter Kjaer: It was awesome to see the amount of check-ins this morning. I even had a look at the code and didn't find anything questionable :)
[6:01:50 AM] Peter Kjaer: ok, smilie overload hehe
[6:04:04 AM] Angel Puntero: hehe, hi Peter, you are the person I wanted to speak to
[6:04:32 AM] Peter Kjaer: yeah? what's up?
[6:05:31 AM] Angel Puntero: It´s about the UI Model changes and the proxyclasses
[6:05:45 AM] *** Albert Romkes added Dominic Cronin ***
[6:05:55 AM] Peter Kjaer: hey Dom
[6:07:13 AM] Angel Puntero: I saw that the Model.config has references to the services, and I was wondering how is it going to work
[6:07:24 AM] Angel Puntero: maybe you can give me a quick overview
[6:12:32 AM] Peter Kjaer: well, the Web UI framework will generate the proxy class when it loads the configuration setting
[6:14:09 AM] Angel Puntero: Tridion.Web.UI?
[6:14:30 AM] Peter Kjaer: Tridion.Web.UI.Core yeah
[6:15:46 AM] Angel Puntero: mmm ok, I was wandering looking for the code that generates the proxyclasses
[6:16:10 AM] Angel Puntero: hehe
[6:17:28 AM] Peter Kjaer: well the code that *actually* generates it would be in the .NET framework (System.Web.Script.Services.ProxyGenerator)
[6:17:40 AM] Peter Kjaer: GetClientProxyScript method
[6:18:29 AM] Peter Kjaer: but the Core does some other stuff too related to caching, combining files, etc.
[6:20:09 AM] Angel Puntero: great, thanks for the explanation! I´m not sure if I dare to decompile the Tridion.Web.UI.Core to take a look
[6:20:21 AM] Peter Kjaer: hehe
[6:20:35 AM] Peter Kjaer: it's not all that interesting, honestly
[6:21:33 AM] Peter Kjaer: it's basically handling caching, calling the ProxyGenerator, and then applying filters on the result based on the configuration (where merging is an example of the filter and so is minifying the content)
[6:21:49 AM] Peter Kjaer: not much more to it
[6:22:04 AM] Peter Kjaer: but if you can't control yourself, the code is in the CachedJsService class :)
[6:23:43 AM] Angel Puntero: Yeah, too curious, I´m already on it :)
[6:24:10 AM] Angel Puntero: it´s always interesting to know how the guts work
[6:24:34 AM] Peter Kjaer: believe me, I know
[6:25:49 AM] Peter Kjaer: lunch time - back in a bit!
[6:26:32 AM] Angel Puntero: see you, enjoy your meal!
[7:15:07 AM] Nuno Linhares: good morning guys
[7:15:28 AM] Angel Puntero: Hi Nuno
[7:15:43 AM] Nuno Linhares: [Thursday, October 20, 2011 7:18 PM] Chris Summers: 

<<< Nuno always said I was the worst boss ever
[7:15:46 AM] Nuno Linhares: not always
[7:15:48 AM] Nuno Linhares: :)
[7:17:58 AM] Frank van Puffelen: It takes experience to know that. ;)
[8:38:35 AM] Chris Summers: Moring all
[8:38:47 AM] Peter Kjaer: hiya
[8:39:03 AM] Chris Summers: Also excited to see new things in my toolbar
[8:39:15 AM] Chris Summers: None of them do anything, but they are shiny
[8:39:40 AM] Peter Kjaer: yeah - I'm sure the functionality will come later (today, right!?)
[8:40:09 AM] Chris Summers: Shoudl any of the buttons do anything?
[8:40:18 AM] Chris Summers: I could have set it up wrong
[8:40:22 AM] Mark Williams: Hey Chris
[8:40:49 AM] Peter Kjaer: I don't think so, Chris
[8:40:52 AM] Mark Williams: The ones that John, Mark and myself are working on should open popup windows but that's about it
[8:41:13 AM] Chris Summers: OK, I don't even have that, so must have setup up something wrong
[8:41:13 AM] Mark Williams: We're working on the actual functionality of the tools at the moment
[8:41:28 AM] Chris Summers: I figured it couldn't be that easy
[8:41:30 AM] Peter Kjaer: cache?
[8:41:51 AM] Chris Summers: I assum I have to copy the Model DLL into webroot/bin?
[8:41:56 AM] Nuno Linhares: To be honest, I think the "easiest" part is all the back-end code (except for *@!#)@!@#&* Component Synchronizer)
[8:41:57 AM] Peter Kjaer: yeah
[8:42:26 AM] Peter Kjaer: but I think I saw post-build events that did that
[8:42:30 AM] Chris Summers: I agree, once you have a popup, and a JS call to a service, the backend stuff is just normal .NET work
[8:42:30 AM] Nuno Linhares: so I'd be really happy to see people create buttons and aspx and fields and selectors and whatever and leave the rest to me :)
[8:42:52 AM] John Winter: morning/afternoon all
[8:42:53 AM] Peter Kjaer: We still need error handling on the client, though
[8:42:59 AM] Nuno Linhares: details
[8:43:02 AM] Peter Kjaer: greetings King Winter
[8:43:14 AM] Nuno Linhares: King John
[8:43:21 AM] Chris Summers: Wow, Peter is clearly not from the field
[8:43:27 AM] John Winter: please no!
[8:43:33 AM] Peter Kjaer: you're right, that's better
[8:43:37 AM] Chris Summers: Altjough some of the eror handling from R&D canbe "Special" too
[8:43:53 AM] Chris Summers: Can I be Duke Summer then?
[8:44:07 AM] Nuno Linhares: Frank had an interesting opinion about errors... if you're not going to fix the error, then don't bother catching it
[8:44:09 AM] Chris Summers: I promis to bow down to King John
[8:44:18 AM] Nuno Linhares: You're Our Glorious Leader
[8:44:46 AM] John Winter: i'm the leader of Mark[] only - and even they don't listen to me
[8:44:48 AM] Peter Kjaer: I thought he was the Über MvP?
[8:44:54 AM] John Winter: i'm LVP
[8:45:08 AM] Peter Kjaer: now now
[8:45:15 AM] Chris Summers: My code name is COrsair: http://marvel.com/universe/Corsair
[8:45:30 AM] Nuno Linhares: OK. PowerTools discussion
[8:45:49 AM] Nuno Linhares: you can all be whatever you want. Just build a freakin tool
[8:45:59 AM] Peter Kjaer: hehe
[8:46:12 AM] Chris Summers: OK, so I need to put  the model DLL in the bin or webroot?
[8:46:19 AM] Nuno Linhares: The "Our Glorious Leader" was for Chris actually, not John
[8:46:21 AM] Chris Summers: like we did with the old services.dll
[8:46:24 AM] Nuno Linhares: webroot/bin
[8:46:30 AM] Nuno Linhares: yes
[8:46:45 AM] Nuno Linhares: The Post-Build event that I suggest in the no-nonsense guide would do this for you
[8:46:55 AM] Nuno Linhares: though I realize that it was perhaps a bit too greedy
[8:47:30 AM] Nuno Linhares: *.dll might not be the best way to deploy, specially after upgrading to SP1
[8:48:20 AM] Chris Summers: I kind of agree, why did Yoav shun build events and insist on DLLs
[8:48:43 AM] Chris Summers: What alternatives do we have to a DLL deployment
[8:49:11 AM] Frank van Puffelen: @Nuno: did I instill enough fear with my "it'll al l break with SP1"? ;)
[8:49:24 AM] Nuno Linhares: We could deploy uncompiled CS files to /app_code (I think) but I don't see anything wrong with deploying DLLs
[8:49:33 AM] Nuno Linhares: Frank: It doesn't actually break everything
[8:49:51 AM] Frank van Puffelen: One thing you may want to do is simply set "Copy Local" to false for all Tridion assemblies. That makes chances of wrecking your shared bin directory a lot smaller.
[8:50:05 AM] Nuno Linhares: it broke a couple of things but I'm pretty sure it's because my post build xcopy of *.dll also deployed the non-SP1 Tridion.Web.UI.core
[8:50:11 AM] Frank van Puffelen: @Nuno: doubtful. Unless the assemblies didn't change in SP1.
[8:50:27 AM] Frank van Puffelen: Yup, so unless that didn't change in SP1, it will affect it.
[8:50:31 AM] Nuno Linhares: and I didn't have time to go back and debug why it didn't work
[8:50:43 AM] Frank van Puffelen: But indeed: it will not break straight away. The SP1 assemblies have the same version number.
[8:50:50 AM] Nuno Linhares: so far
[8:51:08 AM] Frank van Puffelen: So: it will simply revert to old functionality, not break anythings more serious than that. ;)
[8:51:25 AM] Vesa Paakkanen: we should have an Ant-script for the build ;)
[8:51:29 AM] Vesa Paakkanen: just my two cents
[8:51:40 AM] Nuno Linhares: sure. Build one
[8:51:49 AM] Nuno Linhares: :)
[8:52:06 AM] Nuno Linhares: OK, I have a cat to go feed. See you guys in an hour or so
[8:52:16 AM] Vesa Paakkanen: Maybe if I have time this weekend I might as well
[8:52:36 AM] John Winter: @nuno - is that a euphemism?
[8:53:20 AM] Peter Kjaer: what would the ant script be for?
[8:53:31 AM] Chris Summers: I am heading up to the mountains for the weekend to get some peace and quiet and focus on this
[8:53:58 AM] Vesa Paakkanen: @Peter for easy deployment
[8:54:39 AM] Peter Kjaer: for us? or customers?
[8:54:54 AM] Peter Kjaer: customers would use an installer, right? (once we add it)
[8:55:29 AM] Peter Kjaer: I didn't have a problem with the post-build events - all I have to do is build the solution and I've got the latest. That's why I was wondering what the ant script would add.
[8:56:36 AM] Vesa Paakkanen: easier to maintain if there is gonna be more stuff than those two post-build xcopy commands
[8:56:42 AM] Vesa Paakkanen: unit tests etc
[8:56:47 AM] Vesa Paakkanen: documentation
[8:57:38 AM] Vesa Paakkanen: basically so the thing would work just be getting everything from version control and then running the script
[8:58:18 AM] Frank van Puffelen: Assuming people have ant, and know java.
[8:58:24 AM] Vesa Paakkanen: yes, end-users would probably use installer but for developers a build tool is nice
[8:58:31 AM] Vesa Paakkanen: http://nant.sourceforge.net/
[8:58:39 AM] Frank van Puffelen: If at all possible, I try to stay away from build scripts in .NET projects.
[8:58:45 AM] Peter Kjaer: well yeah, it should be NANT if anything
[8:58:53 AM] Peter Kjaer: but I don't see the point in one at the moment
[8:59:08 AM] Peter Kjaer: but hey, if you build it - running it would be optional anyway :)
[8:59:11 AM] Chris Summers: I tend to agree with the Nee sayers here
[8:59:26 AM] Frank van Puffelen: "We are the knights that say 'ni'"
[8:59:37 AM] Chris Summers: introducing more technologies to the base project is a good way to put people off the development
[8:59:57 AM] Vesa Paakkanen: [8:58 AM] Frank van Puffelen: 

<<< If at all possible, I try to stay away from build scripts in .NET projects.that's why in general .Net projects I see are a pain to get running ;)
[9:00:40 AM] Chris Summers: Perhaps we could add a sub section to the project which has a "Tools of the trade" in it as an optional way of doing things. SO an ANT script or the post build script
[9:00:52 AM] Vesa Paakkanen: I agree that this point there is not much value
[9:01:13 AM] Vesa Paakkanen: but when the project grows certain level of automation is really beneficial
[9:01:50 AM] Peter Kjaer: agreed - we use both Ant, NAnt, and PowerShell for automation - but I wouldn't do that unless there's a particular need
[9:02:12 AM] Vesa Paakkanen: I just saw you guys talking about the deployment and wanted to share my thoughts
[9:02:36 AM] Vesa Paakkanen: I actually prefer Maven over Ant but that is completely other discussion
[9:03:11 AM] Peter Kjaer: yeah, we generally use Maven to tie the whole thing together and handle dependencies
[9:05:23 AM] Peter Kjaer: anyway, let's indeed keep it simple for now
[9:05:24 AM] Vesa Paakkanen: I have way too many things that I would like to work on regarding Powertools but way too little time
[9:05:41 AM] Peter Kjaer: hehe yeah :)
[9:05:59 AM] Vesa Paakkanen: much more interesting than "real" work ;)
[10:02:42 AM] *** Peter Kjaer added Jules ***
[10:14:31 AM] John Winter: testing one - two (for jules!)
[10:15:03 AM] Jules: oh there we go
[10:15:07 AM] Jules: ta chuck
[10:15:12 AM] John Winter: de rien
[10:15:24 AM] Peter Kjaer: did you get all the old messages, or only the new one?
[10:19:55 AM] Nuno Linhares: Only new ones
[10:21:35 AM] Nuno Linhares: OK, I have to make one simple statement, then I'll shut up and let you guys resume your awesome work.
[10:22:01 AM] Nuno Linhares: The old powertools were great because you didn't have to know much to build one (even I wrote a couple)
[10:22:39 AM] Nuno Linhares: we have to keep this framework as simple as possible. It's complex enough to understand CoreService, Anguilla, and Javascript (not to mention asynchronous programming)
[10:23:19 AM] Nuno Linhares: so, no crazy only-yoav-would-understand code please. No Uber-super-duper build scripts that break if you forget to add one file to a somewhat-weird-looking-file
[10:24:04 AM] Nuno Linhares: Keep it simple. Later on if/when we have a stable bunch of PowerTools that actually work and we can call a 1.0, we can look into correct development and maybe even have people really "own" the thing
[10:24:29 AM] Nuno Linhares: for now, I think we really just need to focus on making it easy(er) for people to build some
[10:24:34 AM] Nuno Linhares: and know I shut up
[10:24:48 AM] Jules: phew... thought he'd never finish
[10:24:52 AM] Jules: :P
[10:24:54 AM] Vesa Paakkanen: :D
[10:28:04 AM] Vesa Paakkanen: @Nuno I totally agree that it has to be easy for people to understand. But (there is always a but) I have to defend the build script a bit because if done right it actually enables anyone to build the thing without any other knowledge than the line to run the script. And like mentioned before it is not relevant right not and can be done much later :)
[10:28:52 AM] Vesa Paakkanen: I just played around with Ruby on Rails and Ruby Gems and it was so nice and easy to build and install ruby gems (and ruby web apps for that matter) that I don't know why I'm even working with Java/C#
[10:29:39 AM] Vesa Paakkanen: but I'm getting sidetracked again
[10:29:45 AM] Frank van Puffelen: Vesa: yes, but == no
[10:31:43 AM] Nuno Linhares: Thanks Frank. Yes, Vesa, I agree with you that we _should_ but (ask Chris on this one) I don't want the powertools to be this amazing engineering feat that 2 or 3 people can change
[10:31:48 AM] Peter Kjaer: hehe I think you're both right. It should be easy to develop and test and that might take a build script if we end up with too many parts. We're not at that point, though, so no worries.
[10:32:34 AM] Frank van Puffelen: And we ARE at the point where it is already too difficult for most people to write a PowerTool, let alone the Nooch of 5 years ago.
[10:33:26 AM] Peter Kjaer: maybe to write a new tool, but not to deploy it. Like I said earlier, it's just get the latest and build the solution. Anyone can do that.
[10:33:59 AM] Peter Kjaer: I agree that we still have a long way to go in terms of making it easy to write a new tool - Nuno's guide clearly shows that.
[10:34:52 AM] Peter Kjaer: but let's not forget that it's only been a few weeks since most of us started working on this thing in our spare time :)
[10:35:17 AM] Peter Kjaer: so I think we're doing great in that regard
[10:35:54 AM] Frank van Puffelen: Yup, I indeed meant writing a new tool. I'm quite sure Nuno was refering to "even writing a few of the original PowerTools himself".
[10:36:20 AM] Frank van Puffelen: But indeed, nothing to worry about. The project seems to come along fine, it builds straight out of TFS and most people here seem to have gotten it to work.
[10:36:51 AM] Frank van Puffelen: It's just that apparently you need guidance from either King Winter or R&D to create you own tool from scratch, so that is something I want to work on at some point.
[10:37:51 AM] Frank van Puffelen: Most stumbling happens around the GUI parts, so I'm thinking of ways to hide most of that (at the cost of not having full control over the GUI for your powertool) for some of the more common tools.
[10:37:57 AM] Frank van Puffelen: But alas... so little time, so much to do. :-/
[10:39:03 AM] Vesa Paakkanen: so you're thinking of wrapping Anguilla with some PowerTools GUI Framework?
[10:39:18 AM] Peter Kjaer: we dpm
[10:39:21 AM] Vesa Paakkanen: which would be more limited but easy to use for the needs of powertools
[10:39:21 AM] Peter Kjaer: err
[10:39:30 AM] Peter Kjaer: we don't need another framework, is what I meant to say
[10:39:45 AM] Vesa Paakkanen: it doesn't really need to be a "framework" per se
[10:39:49 AM] Vesa Paakkanen: but some helper
[10:39:51 AM] Frank van Puffelen: I agree Peter. We need fewer steps to write a PowerTool.
[10:40:02 AM] Peter Kjaer: but that is why I proposed the base class for the JavaScript classes
[10:40:11 AM] Peter Kjaer: that would cut down on the coding needed to make a tool
[10:40:22 AM | Edited 10:40:56 AM] Vesa Paakkanen: base classes usually cause a horrible dependency chain
[10:40:30 AM] Vesa Paakkanen: which I've come to learn the hard way
[10:40:33 AM] Vesa Paakkanen: Interfaces are the way to go
[10:40:37 AM] Frank van Puffelen: You should've seen Nuno from where I was sitting last week. It was simply too many steps for even him.
[10:40:59 AM] Frank van Puffelen: Vesa: interfaces in Anguilla speak, are multiple-inheritance base-classes. :)
[10:41:41 AM] Vesa Paakkanen: I have to dive deeper into Anguilla
[10:42:02 AM] Vesa Paakkanen: because for example I had problems with creating two almost similar buttons without duplicating code
[10:42:24 AM] Frank van Puffelen: But I also have to agree with Peter here: a common base class is a good way to get some of the plumbing out of the way.
[10:42:25 AM] Vesa Paakkanen: https://github.com/Dige/Tridion-GUI-Extensions/wiki/How-to-parametrize-commands
[10:42:35 AM] Vesa Paakkanen: for example
[10:42:52 AM] Vesa Paakkanen: that's what I gathered when I was working on my first GUI extension
[10:42:54 AM] Peter Kjaer: base classes do not by themselves cause problems with dependencies. Maybe using them wrongly would, but there is nothing wrong with a good base class :)
[10:42:57 AM] Vesa Paakkanen: any feedback is appreciated
[10:43:19 AM] Frank van Puffelen: I have been reading your wiki pages with great interest.
[10:43:26 AM] Vesa Paakkanen: @Peter agreed if they are reviewed and refactored then its no problem
[10:43:53 AM] Frank van Puffelen: It's good to see people documenting their findings. I do hope that  at some point we can get them all here on the PowerTools wiki. :)
[10:43:56 AM] Vesa Paakkanen: I might be wrong in many cases as that was my first extension so don't hang me for any errors :)
[10:44:04 AM] Peter Kjaer: The C# coding guidelines had a good section on when you should use a base class versus when you should use an interface
[10:44:18 AM] Vesa Paakkanen: I just wanted to create a quick reference for anyone starting their GUI extensions
[10:44:28 AM] Vesa Paakkanen: and I *think* I achieved that somehow
[10:44:46 AM] Peter Kjaer: we don't hang people here
[10:44:49 AM] Peter Kjaer: we burn them
[10:44:51 AM] Peter Kjaer: :)
[10:44:58 AM] Frank van Puffelen: (ninja)
[10:45:21 AM] Frank van Puffelen: Unless it's Julian, him we just tickle to death
[10:45:27 AM] Vesa Paakkanen: ah, that's ok then, I'm immune to burning after eating the pasta sauce my girlfriend made (she put bit too much habanero sauce on it)
[10:45:27 AM] Peter Kjaer: (beer) o' clock here
[10:45:38 AM] Vesa Paakkanen: @Peter indeed, up I go -->
[10:45:41 AM] Frank van Puffelen: :)
[10:49:21 AM] Nuno Linhares: wait, what do you mean (beer) o'clock? Build one more powertool!
[10:49:27 AM] Nuno Linhares: (devil)
[10:49:39 AM] Jules: :)
[10:49:40 AM] Jules: OK, beer time
[10:50:10 AM] Peter Kjaer: I only work on the PowerTools *after* I've had beer - couldn't you tell? :)
[10:50:21 AM] Nuno Linhares: :)
[10:53:31 AM] Frank van Puffelen: (nerd)(beer) (puke) |-) :^)
[10:53:46 AM] Frank van Puffelen: In my defense: it was more than 1 beer. :)
[10:53:59 AM] Nuno Linhares: lol
[10:54:26 AM] Frank van Puffelen: See: a comic in Skype smileys.
[10:54:50 AM] Peter Kjaer: lol
[10:56:48 AM] Peter Kjaer: unfortunately, they only have Heineken here - which I don't consider beer. So the PowerTools will have to wait until I get home :) Speaking of which, I'm out of here! TTYL
[10:57:16 AM | Edited 10:57:19 AM] Frank van Puffelen: (wave)
[11:18:53 AM] Angel Puntero: Is there any documentation for the Anguilla framework?
[11:19:35 AM] Frank van Puffelen: Yes, there is some things documented in the online docs and there's an API reference zip.
[11:20:10 AM] Frank van Puffelen: http://sdllivecontent.sdl.com/LiveContent/content/en-US/SDL_Tridion_2011/concept_DC9C231E60874E3386BBAF129328D9AD
[11:21:40 AM] Frank van Puffelen: And for the other one:
1. Go to http://sdltridionworld.com/
2. Log in
3. go to Download > Documentation > SDL Tridion 2011
4. Find GUI Extension API in the (horribly jumpy) list of Related Downloads
[11:22:38 AM] Angel Puntero: Yes, thats the one i have, the API reference
[11:22:52 AM] Angel Puntero: lets see if I can learn something in the live content
[11:24:12 AM] Nuno Linhares: Live Content is not too bad, but very light-weight...
[11:24:43 AM] Frank van Puffelen: You'll learn more by doing a few searches. And clicking Vesa's link.
[11:24:50 AM] Angel Puntero: what I find more difficult is to learn how to us controls, usually find myself going through the CME to try to find an example
[11:25:10 AM] Frank van Puffelen: Same here.
[11:25:22 AM] Vesa Paakkanen: @Angel: https://github.com/Dige/Tridion-GUI-Extensions/wiki
[11:25:23 AM] Frank van Puffelen: You can do one better than me and document it somehwere. ;)
[11:25:24 AM] Vesa Paakkanen: have you checked that?
[11:26:13 AM] Angel Puntero: nope, lets take a look :)
[11:26:35 AM] Vesa Paakkanen: it's just the basics but I hope it helps a bit :)
[11:57:16 AM] Angel Puntero: Arg, when I´m testing a GUI Extension and get a JS error, It´s so hard to spot where the error is, because all the code comes minified
[11:57:54 AM] Nuno Linhares: Frank knows how to change that
[11:58:06 AM] Nuno Linhares: there's a setting somewhere in System.Config I think
[11:58:35 AM] Angel Puntero: Frank save me!
[11:59:06 AM] Frank van Puffelen: Hold on.
[11:59:20 AM] Frank van Puffelen: Or: find your System.config, while I look up the exact setting to change.
[11:59:50 AM] Albert Romkes: Please put it on the wiki!
[11:59:56 AM] Frank van Puffelen:       <filter for="Script" type="Tridion.Web.UI.Resources.Filters.JScriptMinifier, Tridion.Web.UI.Resources.Filters" enabled="never">
[12:00:08 PM] Angel Puntero: Cool
[12:00:18 PM] Frank van Puffelen: In your file  it says enabled="always" or something like that.
[12:01:08 PM] Frank van Puffelen: And indeed: please put it on the wiki. ;)
[12:01:23 PM] Angel Puntero: thank you! will do
[12:02:44 PM] Nuno Linhares: OK, who's working on the "Mark as Unpublished" Power Tool?
[12:03:17 PM] Mihai Cadariu: ME... if nobody takes it
[12:03:17 PM] Nuno Linhares: Whenever the person reads this message, ping me. It's not going to work until SP1 I think
[12:03:21 PM] Nuno Linhares: OK
[12:03:38 PM] Nuno Linhares: The API for setting the publish/unpublish status of an item is marked internal on 2011
[12:03:51 PM] Nuno Linhares: it's only available with Interops currently
[12:04:08 PM] Nuno Linhares: Frank filed an ER for this, but not sure if it's going to make it to SP1...
[12:04:20 PM] Frank van Puffelen: I doub it.
[12:05:02 PM] Mihai Cadariu: then i guess we will use interop for the time being
[12:05:06 PM] Nuno Linhares: booo
[12:05:16 PM] Nuno Linhares: :)
[12:05:51 PM] Frank van Puffelen: @Mihai: that indeed what I do in my "track unpublish of binaries" extension.
[12:11:46 PM] Nuno Linhares: I guess my boo-ing is more related to adding the interops to the project than having this specific tool use it...
[12:12:01 PM] Nuno Linhares: but if there's no way around it, there's no way around it
[12:16:08 PM] Mihai Cadariu: i agree. not nice, but the only way to do it apparently...
[12:16:14 PM] Mihai Cadariu: so it becomes best practice ;)
[12:16:18 PM] Nuno Linhares: lol
[12:16:35 PM] Nuno Linhares: As I always say, the best practice is the one that works
[12:26:20 PM] *** Nuno Linhares has changed the conversation topic to "Tridion PowerTools 2011" ***
[12:39:44 PM] Nuno Linhares: @Albert: great job on the ItemPicker and the Publication Dropdown, quite impressive :)
[1:01:35 PM] Albert Romkes: Thanx. After finishing I was at stage 6. But shortly after I found myself back in stage 2 ;)
[1:03:44 PM] Mihai Cadariu: trying to get latest version:
Error: REPORT of '/svn/!svn/vcc/default': Could not read response body: An existing
[1:04:54 PM] Albert Romkes: hmm works fine here
[1:05:28 PM] Mihai Cadariu: seems super slow for me 400 bytes/s
[1:07:20 PM] Albert Romkes: I think its google. I have the same problems sometimes
[1:12:57 PM] Mihai Cadariu: cloud is down
[1:14:39 PM] Mihai Cadariu: i managed to get the latest finally
[1:14:45 PM] Mihai Cadariu: i see some inconsistencies:
[1:14:56 PM | Edited 1:16:07 PM] Mihai Cadariu: #1 powertools - editor
[1:14:59 PM] Mihai Cadariu: powertools - model
[1:15:04 PM] Mihai Cadariu: but powertools.common
[1:15:40 PM] Mihai Cadariu: should not there be also powertools - common (with a dash) ?
[1:16:23 PM] Mihai Cadariu: #2 PowerTools2011 - Model contains another nested PowerTools2011 - Model folder directly underneath
[1:16:52 PM] Mihai Cadariu: this is not like the other projects editor and model where there is no nested folder underneath it
[1:18:10 PM] Mihai Cadariu: if you don't mind, i would fix this... check back in
[1:18:33 PM] Nuno Linhares: I'm fine with you fixing it
[1:18:57 PM] Mihai Cadariu: i think i'll rename the folders to be with a dot instead of a dash
[1:19:01 PM] Mihai Cadariu: PowerTools2011.Editor
[1:19:11 PM | Edited 1:19:20 PM] Mihai Cadariu: make them all consistent with the VS project names
[1:31:45 PM] Mihai Cadariu: there is a folder \PowerTools2011 - Editor\Service References that is not in SVN, but got created when i opened VS
[1:31:52 PM] Mihai Cadariu: should I add it to SVN?
[1:31:56 PM] Mihai Cadariu: it's empty
[1:32:04 PM] Mihai Cadariu: should i just delete it from VS?
[1:32:20 PM] Mihai Cadariu: don't understand why this is there
[1:33:33 PM] Albert Romkes: Its created by VS...
[1:33:33 PM] Albert Romkes: I think you can safely delete it
[1:33:38 PM] Mihai Cadariu: k
[1:57:58 PM] Mihai Cadariu: i just checked in the renamed stuff
[1:58:02 PM] Mihai Cadariu: PLEASE GET LATEST!!!
[2:11:14 PM] Angel Puntero: With the latest changes, the System.config needs to be changed to match the  naming changes
[2:12:58 PM] Angel Puntero: Because it points to "PowerTools2011 - Editor", will put a reminder in the news
[2:13:17 PM] Mihai Cadariu: indeed.. i have not changed that
[2:13:22 PM] Mihai Cadariu: will you or shall i?
[2:14:05 PM] Angel Puntero: I mean, everybody who has a working environment with the power tools, needs to change his local system.config to match the changes
[2:14:51 PM] Mihai Cadariu: gotcha
[2:15:19 PM] Angel Puntero: I´ll put a reminder
[2:18:27 PM] Angel Puntero: mm i cant modify (or dont know) the welcome page
[2:18:31 PM] Angel Puntero: can you check Mihai?
[2:33:06 PM] Mihai Cadariu: sure.. which welcome page is it?
[2:33:11 PM] Mihai Cadariu: url please...
[2:34:44 PM] Angel Puntero: I wanted to put a notice in the main project page: http://code.google.com/p/tridion-2011-power-tools/
[2:35:04 PM] Angel Puntero: in the updates section
[2:35:28 PM] Angel Puntero: but maybe it needs to be an owner
[2:35:41 PM] Nuno Linhares: I can probably do it
[2:35:57 PM] Mihai Cadariu: i cannot modify it
[2:38:50 PM] Chris Summers: I all, just catching up
[2:39:11 PM] Chris Summers: @mihai if you changed the folders, can you update the config.fragment files to match also
[2:39:30 PM] Mihai Cadariu: ok will do
[2:39:34 PM] Chris Summers: Thanks
[2:41:34 PM] Angel Puntero: I updated the Editor.Fragment.Config, I think there isnt more changes needed
[2:42:31 PM] Nuno Linhares: OK, so all the notice on the page should say is that you need to re-do your system.config
[2:42:33 PM] Nuno Linhares: right?
[2:42:43 PM] Angel Puntero: And change the iis virtual folder
[2:42:44 PM] Nuno Linhares: from Editor.Fragment.Config and Model.Fragment.Config?
[2:42:51 PM] Angel Puntero: to point the new one
[2:42:52 PM] Nuno Linhares: and the folder, because the path changed
[2:43:05 PM] Angel Puntero: yup, thats it
[2:44:16 PM | Edited 2:44:52 PM] Mihai Cadariu: i'm too late.. Angel beat me to it ;) - i'm talking about the Editor.Fragment.Config only
[2:44:29 PM | Edited 2:44:30 PM] Nuno Linhares: done, in red
[2:44:38 PM] Angel Puntero: :D
[2:46:51 PM] Angel Puntero: well, enough for me today, see you!
[2:47:00 PM] Nuno Linhares: bye Angel, have a good weekend
[2:47:21 PM] Chris Summers: So now the folders have changed, do we need to change them locally, or just checkout the latest
[2:47:55 PM] Nuno Linhares: checkout the latest should do the changes for you
[2:48:02 PM] Nuno Linhares: you need to change System.Config and Vdir?
[2:48:04 PM] Mihai Cadariu: i added a comment to [Editor.Fragment.Config]
[2:48:34 PM] Mihai Cadariu: if you have bin and obj folders, they might be left behind in the old folder names... just remove them
[3:12:14 PM] Mihai Cadariu: now i see the project names contain 2011 in their name
[3:12:37 PM] Mihai Cadariu: i think indeed i shuold have removed that 2011 too
[3:12:53 PM] Nuno Linhares: Remove it. Quick, while the europeans are sleeping
[3:12:57 PM] Mihai Cadariu: i can do it if you don't mind
[3:12:58 PM] Mihai Cadariu: ok
[3:12:58 PM] Mihai Cadariu: :D
[3:13:01 PM] Vesa Paakkanen: I hear you!
[3:13:14 PM] Mihai Cadariu: you blink, I rename it
[3:13:17 PM] Vesa Paakkanen: nooo
[3:13:21 PM] Nuno Linhares: LOL
[3:13:45 PM] Frank van Puffelen: Darn... why is that European guy still awake?
[3:13:50 PM] Frank van Puffelen: Can somebody sedate him?
[3:13:56 PM] Vesa Paakkanen: It's only 9pm here
[3:14:09 PM] Nuno Linhares: actually... now that I look at it... we're ALL european
[3:14:13 PM] Mihai Cadariu: damn.. i'll do it in 6 hours then :)
[3:14:19 PM] Frank van Puffelen: On a Friday! You're supposed to be properly drunk by now.
[3:14:22 PM] Vesa Paakkanen: I'm having a beer
[3:14:29 PM] Frank van Puffelen: @nuno: ;)
[3:14:41 PM] Nuno Linhares: except for Vin, I guess... technically he's british I think
[3:14:50 PM] Mihai Cadariu: kidding. i'm renaming right now
[3:15:23 PM] Mihai Cadariu: i'm having a beer too :)
[3:15:47 PM] Frank van Puffelen: At 12:15?
[3:15:48 PM] Nuno Linhares: http://www.retrooutlet.com/prodimages/0204.jpg
[3:16:22 PM] Mihai Cadariu: it's not the first one for the day :D
[3:16:27 PM] Vesa Paakkanen: it's never too late or early for a beer
[3:16:48 PM] Frank van Puffelen: @vesa: hear hear...
[3:16:49 PM] Nuno Linhares: spoken like a real nordic
[3:16:50 PM] Mihai Cadariu: @nuno: ROFL
```