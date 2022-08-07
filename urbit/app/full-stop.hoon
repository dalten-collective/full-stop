::  full-stop.
::
/-  *blood
/+  default-agent, dbug, agentio
::
|%
++  lunar  |$([a] ((on time a) gth))
++  cycle  |$([a] ((mop time a) gth))
::
+$  versioned-state  $%(state-0)
+$  state-0
  $:  %0
      =moon                                              ::  cycles
      =spot                                              ::  spotting
      =rain                                              ::  mucosal discharge
      =fire                                              ::  basal body temp
      =bear                                              ::  pregnancy
      =hold                                              ::  birth control
      =opts                                              ::  system options
  ==
::
+$  moon  (cycle flow)                                   ::  track cycles
+$  flow                                                 ::  flow includes:
  $:  stop=(unit time)                                   ::    - stop date (or not)
      rate=(cycle rate)                                  ::    - flow rate (or none)
      edit=time                                          ::    - last edit date
  ==
::
+$  spot  (set [p=time edit=time])                       ::  out of cycle bleeding
+$  rain  (cycle [p=cons edit=time])                     ::  track cervical mucousal viscocity
+$  fire  (cycle [p=base edit=time])                     ::  track basal body temperature
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
    :_  this(state [%0 ~ ~ ~ ~ ~ ~ [%.n %.n now.bowl]])
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
    ?.  =(%dot-point mark)  (on-poke:def mark vase)
    =^  cards  state
      (syzygy (flop !<(drop vase)))
    [cards this]
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
++  apogee                                               :: json output
  =,  enjs:format
  |%
  ++  send                                               ::  - send card
    |=  jon=json
    ^-  card
    [%give %fact ~[/website] json+!>(jon)]
  ++  note                                               ::  - send error message
    |=  [m=^tape j=json]
    (send (pairs ~[message+s+(crip m) error+j]))
  ++  flow                                               ::  - send add/del period
    |=  [wen=^time flew=(unit ^flow)]
    ^-  card
    =/  tick  (lunar rate)
    ?~  flew  (send (frond del-flow+(sect now.bol)))
    =;  flan=json
      (send (frond add-flow+a+~[(sect now.bol) flan]))
    %-  pairs
    :~  stop+?~(stop.u.flew ~ (sect u.stop.u.flew))
        edit+(sect edit.u.flew)
        :+  %rate  %a
        ^-  (list json)
        %+  turn  (bap:tick rate.u.flew)
        |=([p=^time q=rate] a+~[(sect p) (numb q)])
    == 
  --
++  syzygy                                               :: input handler
  |=  =drop
  =|  caz=(list card)
  |^
  |-
  ?~  drop  [caz state]
  =^  cards  state
    ?-    -.act.i.drop
      ?(%noti %fert)  (choix i.drop)
      ?(%bear %move)  (petit i.drop)
    ::
        ?(%flow %stop %rate %spot)
      (coeur i.drop)
    ::
        ?(%temp %muco)
      (vivre i.drop)
    ::
        ?(%pill %term %miss %free)
      (pills i.drop)
    ==
  %=    $
    drop  t.drop
    caz  (weld cards caz)
  ==
  ++  coeur
    |=  [san=sanguine den=time]
    =+  tick=(lunar flow)
    ?-    -.san
        %flow
      ?~  (has:tick moon wen.san)
        =/  last=flow  (got:tick moon wen.san)
        ?:  (gth edit.last den)  `state
        :-  ~[(flow:apogee wen.san ~)]
        state(moon +:(del:tick moon wen.san))
      ?~  prior=(tab:tick moon `wen.san 1)
        :-  ~[(flow:apogee wen.san [~ *flow])]
        state(moon (put:tick moon wen.san *flow))
      ?.  ?=(~ stop.val.i.prior)
        :-  ~[(flow:apogee wen.san [~ *flow])]
        state(moon (put:tick moon wen.san *flow))
      =/  last=tape
        =+  dat=(yore key.i.prior)
        "{(scow %ud m.dat)}/{(scow %ud d.t.dat)}/{(scow %ud y.dat)}"
      =-  [~[(note:apogee -)] state]
      =,  enjs:format
      :_  (frond need-flow-stop+(sect key.i.prior))
      """
      The period starting on {last} doesn't have a stop date.
      Please enter one first before entering the start of your next period.
      """
        %stop
      `state
        %rate
      `state
        %spot
      `state
    ==
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