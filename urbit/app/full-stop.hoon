::  full-stop
::
/-  *blood
/+  default-agent, dbug, agentio
::
|%
+$  versioned-state  $%(state-0)
::
+$  state-0  [%0 =moon =rain =fire =bear =hold =opts]
::
+$  moon  ((mop time flow) gth)                          ::  track cycles, flow and non-menstrual spotting
+$  flow                                                 ::  flow includes:
  $:  stop=(unit time)                                   ::    - stop date, or not stopped yet
      rate=((mop time rate) gth)                         ::    - rate of flow per day, bounded by start and stop
      spot=(set time)                                    ::    - out of cycle bleeding, recorded as a set of days on which it occurred
      edit=time                                          ::    - edit time to know which update to honor
  ==
::
+$  rain  ((mop time ,[=cons edit=time]) gth)             ::  track cervical mucousal discharge 
+$  fire  ((mop time ,[=base edit=time]) gth)             ::  track basal body temperature
+$  bear  (unit star=time week=@ud edit=time)            ::  track pregnancy
+$  opts  [noti=? fert=? edit=time]                      ::  options - notifications and fertility predictions
+$  hold
 %-  unit
 $:  $=  type
     $%  [%pill h=@ud m=@ud am=? miss=(set time)]       ::  track hormonal pill b.c., record missed pills
         [%term wen=time]                               ::  track implant/term b.c., record replacement date
     ==
     edit=time
 ==
::
+$  card  card:agent:gall
--  
::
%-  agent:dbug
::
=|  state-0
=*  state  -
::
^-  agent:gall
=<
  |_  =bowl:gall
  +*  this  .
      def   ~(. (default-agent this %|) bowl)
      hc    ~(. +> bowl)
      io    ~(. agentio bowl)
      pass  pass:io
  ++  on-init
    ^-  (quip card _this)
    %-  (slog '%full-stop -online' ~)
    :_  this(state [%0 ~ ~ ~ ~ ~ [%.n %.n now.bowl]])
    ~[(~(connect pass /eyre) [~ /apps/full-stop/knife] %full-stop)]
  ++  on-save
    ^-  vase
    !>(state)
  ++  on-load
    |=  ole=vase
    ^-  (quip card _this)
    =/  old=state-0  !<(state-0 ole)
    `this(state old)
  ++  on-poke
    |=  [=mark =vase]
    ^-  (quip card _this)
    `this
  ++  on-arvo
    |=  [=wire sign=sign-arvo]
    ^-  (quip card _this)
    ?+    wire  (on-arvo:def wire sign)
        [%eyre ~]
      ?>  ?=([%eyre %bound *] sign)
      ?:  accepted.sign  `this
      %.  `this
      (slog '%full-stop -failed-binding-eyre' ~)
    ==
  ++  on-peek   on-peek:def
  ++  on-fail   on-fail:def
  ++  on-agent  on-agent:def
  ++  on-watch  on-watch:def
  ++  on-leave  on-leave:def
  --
|_  bol=bowl:gall
++  syzygy
  |=  =drop
  =|  caz=(list card)
  |^
  |-
  ?~  drop  [caz state]
  =^  cards  state
    ?-    -.act.i.drop
      ?(%noti %fert)  (choix i.drop)
      ?(%bear %move)  (petit i.drop)
      ?(%flow %stop)  (coeur i.drop)
    ::
        ?(%temp %rate %muco %spot)
      (vivre i.drop)
        ?(%pill %term %miss %free)
      (pills i.drop)
    ==
  %=    $
    drop  t.drop
    caz  (weld cards caz)
  ==
  ++  coeur
    |=  [san=sanguine den=time]
    `state
  ++  vivre
    |=  [pys=physical den=time]
    `state
  ++  petit
    |=  [pag=pregnant den=time]
    `state
  ++  pills
    |=  [con=controls den=time]
    `state
  ++  choix
    |=  [opt=election den=time]
    `state
  --
--