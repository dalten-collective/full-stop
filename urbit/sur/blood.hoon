::  blood, for the blood god, naturally.
::
|%
::
+$  drop  (list [act=activity wen=time])
::
+$  activity
  $%  sanguine
      physical
      election
      controls
      pregnant
  ==
+$  pregnant
  $%  [%bear wen=time]                                   ::  (un)set prengancy (week count per last period)
      [%move wen=time due=?]                             ::  adjust week count by due date or start date
  ==
+$  election
  $%  [%noti on=? wen=time]
      [%fert on=? wen=time]
  ==
::
+$  sanguine
  $%  [%flow wen=time wix=time]                          ::  note menstruation start
      [%stop wen=time wix=time]                          ::  note menstruation stop
      [%rate how=(unit rate) wen=time wix=time]          ::  note flow rate
      [%spot ? wen=time]                                 ::  note spotting
  ==
::
+$  physical
  $%  [%temp =base wen=time]                             ::  note basal body temp for some day
      [%muco =cons wen=time]                             ::  note cervical mucosal consistency
  ==
::
+$  controls
  $%  [%pill wen=@da]                                    ::  set when you take the pill, daily
      [%term wen=@da again=@dr]                          ::  set a term b.c., when to replace it
      [%miss wen=@da]                                    ::  (un)set a missed pill-taking day
      [%free ~]                                          ::  end b.c. tracking
  ==
::
+$  rate  ?(%1 %2 %3 %4 %5)                              ::  light to heavy
+$  cons  ?(%1 %2 %3 %4 %5)                              ::  thick to thin
+$  base  @rs                                            ::  recorded in fahrenheit
--