::  blood, for the blood god, naturally.
::
|%
::
+$  drop  (list [act=activity wen=time])
::
+$  activity
  $%  sanguine
      physical
      controls
      relation
      election
      pregnant
  ==
+$  pregnant
  $%  [%bear ~]                                          ::  (un)set prengancy (week count per last period)
      [%move wen=time due=?]                             ::  adjust week count by due date or start date
  ==
::
+$  election
  $%  [%noti on=? wen=time]                              ::  turn on/off app notifications
      [%fert on=? wen=time]                              ::  turn on/off fertility window
  ==
::
+$  relation
  $%  [%mate wen=time note=(unit @t) barr=?]             ::  note a sexual encounter
      [%drop wen=time]                                   ::  remove a sexual encounter
  ==
::
+$  physical
  $%  [%temp baz=(unit base) wen=time]                   ::  note basal body temp for some day
      [%muco con=(unit cons) wen=time]                   ::  note cervical mucosal consistency
  ==
::
+$  sanguine
  $%  [%flow wen=time]                                   ::  note menstruation start
      [%stop wen=time]                                   ::  note menstruation stop
      [%rate how=(unit rate) wen=time]                   ::  note flow rate
      [%spot wen=time]                                   ::  note spotting
  ==
::
+$  controls
  $%  [%pill wen=time]                                   ::  set when you take the pill, daily
      [%term wen=time again=@dr]                         ::  set a term b.c., when to replace it
      [%miss wen=time]                                   ::  (un)set a missed pill-taking day
      [%free ~]                                          ::  end b.c. tracking
  ==
::
+$  rate  ?(%1 %2 %3 %4 %5)                              ::  light to heavy
+$  cons  ?(%1 %2 %3 %4 %5)                              ::  thick to thin
+$  base  @rs                                            ::  recorded in fahrenheit
--