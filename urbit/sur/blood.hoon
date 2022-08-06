::  blood-for-the-blood-god
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
  $%  [%bear ~ wen=time]                                 ::  (Un)Set Prengancy (Week Count per Last Period)
      [%move wen=time due=?]                             ::  Adjust Week Count by Due Date or Start Date
  ==
+$  election
  $%  [%noti on=? wen=time]
      [%fert on=? wen=time]
  ==
::
+$  sanguine
  $%  [%flow wen=time]                                   ::  Note menstruation start
      [%stop wen=time]                                   ::  Note menstruation stop
  ==
::
+$  physical
  $%  [%temp =base wen=time]                             ::  Note basal body temp for some day
      [%rate =rate wen=time]                             ::  Note flow rate
      [%muco =cons wen=time]                             ::  Note cervical mucosal consistency
      [%spot wen=time]                                   ::  Note spotting
  ==
::
+$  controls
  $%  [%pill wen=@da]                                    ::  Set when you take the pill, daily (for app notifications)
      [%term wen=@da again=@dr]                          ::  Set when you've received a term
      [%miss wen=@da]                                    ::  (Un)Set a missed pill-taking day
      [%free ~]                                          ::  End b.c. tracking
  ==
::
+$  rate  ?(%1 %2 %3 %4 %5)                              ::  Light to Heavy
+$  cons  ?(%1 %2 %3 %4 %5)                              ::  Thick to Thin
+$  base  @rs                                            ::  Recorded in Fahrenheit
--