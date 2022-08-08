::  full-stop.
::
/-  *blood
/+  default-agent, dbug, agentio
::
|%
++  lunar  |$([a] ((on time a) gth))                     ::  mop handling core
++  cycle  |$([a] ((mop time a) gth))                    ::  mop type constructor
::
+$  versioned-state  $%(state-0)
+$  state-0
  $:  %0
      =moon                                              ::  cycles
      =spot                                              ::  spotting
      =rain                                              ::  mucosal discharge
      =fire                                              ::  basal body temp
      =mate                                              ::  sexual encounters
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
+$  spot  (set time)                                     ::  track out of cycle bleeding, loosely (no edit filtering)
+$  rain  (cycle [p=cons edit=time])                     ::  track cervical mucousal viscocity
+$  fire  (cycle [p=base edit=time])                     ::  track basal body temperature
+$  mate  (set [p=time q=(unit @t) r=?])                 ::  track sexual encounters with optional details
+$  bear  (unit [star=time edit=time])                   ::  track pregnancy
+$  opts  [noti=? fert=? edit=time]                      ::  options - notifications and fertility predictions
+$  hold
  %-  unit
  $:  $=  type
      $%  [%pill h=@ud m=@ud am=? miss=(set time)]       ::  track hormonal pill b.c., record missed pills
          [%term wen=time again=time]                    ::  track implant/term b.c., record replacement date
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
    :_  this(state [%0 ~ ~ ~ ~ ~ ~ ~ [%.n %.n now.bowl]])
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
      (syzygy:hc (flop !<(drop vase)))                   ::  handle updates in reverse order
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
  ++  on-watch                                           ::  subscription handling
    |=  pat=path
    ?>  =(our.bowl src.bowl)
    ?.  =([%website ~] pat)  (on-watch:def pat)
    :_  this
    :_  ~
    %-  send:apogee:hc
    %-  pairs:enjs:format
    :~  moon+(moon:give:apogee:hc [%each ~])
        spot+spot:give:apogee:hc
        rain+rain:give:apogee:hc
        fire+fire:give:apogee:hc
        mate+mate:give:apogee:hc
        bear+bear:give:apogee:hc
        hold+hold:give:apogee:hc
        opts+opts:give:apogee:hc
    ==
  ++  on-peek                                            ::  scry handling
    |=  pat=path
    ^-  (unit (unit cage))
    ?+    pat  (on-peek:def pat)
        [%x %all ~]                                      ::  - get front-end startup data
      :+  ~  ~
      =-  json+!>(`json`-)
      %-  pairs:enjs:format
      :~  moon+(moon:give:apogee:hc [%each ~])
          spot+spot:give:apogee:hc
          rain+rain:give:apogee:hc
          fire+fire:give:apogee:hc
          mate+mate:give:apogee:hc
          bear+bear:give:apogee:hc
          hold+hold:give:apogee:hc
          opts+opts:give:apogee:hc
      ==
    ::
        [%x %moon *]                                     ::  - get moon data
      ?.  ?=  $?  [%each ~]
                  [%just @ ~]
                  [%some @ @ ~]
              ==
          +>.pat
        !!
      ``json+!>(`json`(moon:give:apogee:hc +>.pat))
    ::
        [%x %spot ~]
      ``json+!>(`json`spot:give:apogee:hc)
    ::
        [%x %rain ~]
      ``json+!>(`json`rain:give:apogee:hc)
    ::
        [%x %fire ~]
      ``json+!>(`json`fire:give:apogee:hc)
    ::
        [%x %mate ~]
      ``json+!>(`json`mate:give:apogee:hc)
    ::
        [%x %bear ~]
      ``json+!>(`json`bear:give:apogee:hc)
    ::
        [%x %hold ~]
      ``json+!>(`json`hold:give:apogee:hc)
    ::
        [%x %opts ~]
      ``json+!>(`json`opts:give:apogee:hc)
    ::
        [%x %next ~]
      ``json+!>(`json`next:give:apogee:hc)
    ::
    ==
  ++  on-fail   on-fail:def
  ++  on-agent  on-agent:def
  ++  on-leave  on-leave:def
  --
|_  bol=bowl:gall
++  apogee                                               :: json output
  =,  enjs:format
  |%
  ++  note                                               ::  - send error message
    |=  [m=^tape j=json]
    (send (pairs ~[message+s+(crip m) error+j]))
  ::
  ++  send                                               ::  - send card
    |=  jon=json
    ^-  card
    [%give %fact ~[/website] json+!>(jon)]
  ::
  ++  spot                                               ::  - send spot diff
    |=  [old=^^spot new=^^spot]
    ^-  card
    =/  add=(list ^time)  ~(tap in (~(dif in new) old))
    =/  rem=(list ^time)  ~(tap in (~(dif in old) new))
    =;  oke=[p=json q=json]
      (send (pairs ~[add-spots+p.oke del-spots+q.oke]))
    =,  enjs:format
    :-  a+(turn add |=(t=@da (sect t)))
    a+(turn rem |=(t=@da (sect t)))
  ::
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
  ::
  ++  give                                               ::  - send front-end startup data
    |%
    ++  next                                             ::    * predict next cycle
      =+  tick=(lunar ^flow)
      =;  what
        ?-  -.n.what
          %.y  (frond next+(numb:enjs:format +.n.what))
        ::
            %.n
          %-  pairs
          ~[message+s+(crip +<.n.what) error++>.n.what]
        ==
      ^-  [[@ (unit ^time) n=(each @ud [^tape json])] *]
      %^    %-  dip:tick
            $:  c=@ud
                l=(unit ^time)
                n=(each @ud [^tape json])
            ==
          ^moon
        :^  0  *(unit ^time)  %.n
        :_  (frond:enjs:format next-need-data+~)
        """
        We need more consecutive, tracked periods to predict your next period.
        Enter some back-dated periods, if you can remember, and we'll try!
        """  
      |=  $:  $:  c=@ud
                  l=(unit ^time)
                  n=(each @ud [^tape json])
              ==
              [k=^time v=^flow]
          ==
      :: ?:  (gte c 6)  [`v %.y [6 `now.bol [%.y 28]]]
      :: [`v %.y [6 *(unit ^time) [%.y 28]]]
      ?:  (gte c 1)  [~ %.y c l n]
      [~ %.n +(c) l [%.y 28]]
    ++  moon                                             ::    * send cycle information
      |=  wat=?([%each ~] [%some @ @ ~] [%just @ ~])
      ^-  json
      ?~  ^moon  ~
      =+  tick=(lunar ^flow)
      =+  tock=(lunar rate)
      =/  luna=(cycle ^flow)
        ?-  wat
          [%each ~]  ^moon
        ::
            [%just @ ~]
          =+  wen=(slav %da +<.wat)
          %+  gas:tick  ~
          ~[[wen (got:tick ^moon wen)]]
        ::
            [%some @ @ ~]
          %^    lot:tick
              ^moon
            `(sub (slav %da +>-.wat) ~d1)
          `(sub (slav %da +<.wat) ~d1)
        ==
      :-  %a
      %+  turn  (bap:tick ^moon)
      |=  [w=^time f=^flow]
      %-  pairs
      :~  start+(sect w)
      ::
        :-  %flow
        %-  pairs
        :~  stop+?~(stop.f ~ (sect u.stop.f))
            edit+(sect edit.f)
        ::
          :+  %rate  %a
          ^-  (list json)
          %+  turn  (bap:tock rate.f)
          |=([p=^time q=rate] a+~[(sect p) (numb q)])
        ==
      ==
    ++  spot                                             ::    * send spotting dates
      ^-  json
      ?.  =(~ spot.state)  ~
      :-  %a
      (turn ~(tap in spot.state) |=(wen=^time (sect wen)))
    ++  rain                                             ::    * send mucosal consistencies
      ^-  json
      =+  tick=(lunar ,[p=cons edit=^time])
      ?~  ^rain  ~
      :-  %a
      %+  turn  (bap:tick ^rain)
      |=  [wen=^time how=cons edit=^time]
      %-  pairs
      :~  when+(sect wen)
          what+(numb how)
          edit+(sect edit)
      ==
    ++  fire                                             ::    * send basal body temps
      ^-  json
      =+  tick=(lunar ,[p=base edit=^time])
      ?~  ^fire  ~
      :-  %a
      %+  turn  (bap:tick ^fire)
      |=  [wen=^time how=base edit=^time]
      %-  pairs
      :~  when+(sect wen)
          what+s+(scot %rd how)
          edit+(sect edit)
      ==
    ++  mate                                             ::    * send sexual encounters or null
      ^-  json
      ?:  =(~ mate.state)  ~
      :-  %a
      %+  turn  ~(tap in mate.state)
      |=  [p=^time q=(unit @t) r=?]
      %-  pairs
      :~  when+(sect p)
          what+?~(q ~ s+u.q)
          with+b+r
      ==
    ++  bear                                             ::    * send pregnancy or null
      ^-  json
      ?~  barr=^bear  ~
      %-  pairs
      :~  start+(sect star.u.barr)
          weeks+(numb (div (sub now.bol star.u.barr) ~d7))
          edit+(sect edit.u.barr)
      ==
    ++  hold                                             ::    * send b.c. or null
      ^-  json
      ?~  held=^hold  ~
      ?-    -.type.u.held
          %pill
        %-  pairs
        :~  type+s+'pill'
            hour+(numb h.type.u.held)
            mins+(numb m.type.u.held)
            edit+(sect edit.u.held)
        ==
      ::
          %term
        %-  pairs
        :~  type+s+'term'
            when+(sect wen.type.u.held)
            again+(sect again.type.u.held)
            edit+(sect edit.u.held)
        ==
      ==
    ++  opts                                             ::    * send options
      ^-  json
      %-  pairs
      :~  noti+b+noti.^opts
          fert+b+fert.^opts
          edit+(sect edit.^opts)
      ==
    --
  --
++  syzygy                                               :: input handler
  |=  =drop
  =|  caz=(list card)
  |^
  ?~  drop  [caz state]
  =^  cards  state
    ?-    -.act.i.drop
      ?(%noti %fert)  (choix i.drop)
      ?(%bear %move)  (petit i.drop)
      ?(%drop %mate)  (minou i.drop)
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
  ::
  ++  coeur
    |=  [san=sanguine den=time]
    =+  tick=(lunar flow)
    ?-    -.san
        %flow                                            ::  handle add/del period
      =.  wen.san  (sub wen.san (mod wen.san ~d1))       ::  always midnight, sis
      ?:  (has:tick moon wen.san)
        =/  last=flow  (got:tick moon wen.san)
        ?:  (gth edit.last den)  `state                  ::  - ignore old updates
        :-  ~[(flow:apogee wen.san ~)]                   ::  - delete an old period record
        state(moon +:(del:tick moon wen.san))
        ::
      ?~  prior=(tab:tick moon `wen.san 1)
        :-  ~[(flow:apogee wen.san [~ [~ ~ den]])]       ::  - start a period
        state(moon (put:tick moon wen.san [~ ~ den]))
        ::
      ?.  ?=(~ stop.val.i.prior)
        :-  ~[(flow:apogee wen.san [~ [~ ~ den]])]       ::  - start a period
        state(moon (put:tick moon wen.san [~ ~ den]))
        ::
      =/  last=tape
        =+  d=(yore key.i.prior)
        "{(scow %ud m.d)}/{(scow %ud d.t.d)}/{(scow %ud y.d)}"
      =-  [~[(note:apogee -)] state]                     ::  - fail elegantly
      =,  enjs:format
      :_  (frond need-flow-stop+(sect key.i.prior))
      """
      The period starting on {last} doesn't have a stop date.
      Please enter one first before entering the start of your next period.
      """
    ::
        %stop                                            ::  handle stop/adjust period
      =.  wen.san  (sub wen.san (mod wen.san ~d1))       ::  always midnight, sis
      =+  tock=(lunar rate)
      ?~  prior=(tab:tick moon `wen.san 1)
        =/  stop=tape
          =+  d=(yore wen.san)
          "{(scow %ud m.d)}/{(scow %ud d.t.d)}/{(scow %ud y.d)}"
        =-  [~[(note:apogee -)] state]                   ::  - fail gracefully
        =,  enjs:format
        :_  (frond need-flow-start+(sect wen.san))
        """
        There is no known period prior to {stop} to which we can apply this.
        Please enter a period starting before this stop date and resubmit.
        """
        ::
      ?:  (gth edit.val.i.prior den)  `state             ::  - ignore old updates
      ?~  stop.val.i.prior
        =/  val=flow
          :-  `wen.san  :_  den
          %+    lot:tock
              rate.val.i.prior
          [`(add wen.san ~d1) `(sub key.i.prior ~d1)]
        :-  ~[(flow:apogee key.i.prior `val)]            ::  - add a stop date
        state(moon (put:tick moon key.i.prior val))
        ::
      =/  val=flow
        :-  `wen.san  :_  den
        %+    lot:tock
            rate.val.i.prior
        [`(add wen.san ~d1) `(sub key.i.prior ~d1)]
      =/  nu-spot=(set time)                             ::  - out damned spot
        %-  sy
        %+  murn  ~(tap in spot)
        |=  t=@da
        ?:(&((lte key.i.prior t) (lte t wen.san)) ~ `t)
        ::
      ?:  =(spot nu-spot)                                ::  - adjust a stop date
        :-  ~[(flow:apogee key.i.prior `val)]
        state(moon (put:tick moon key.i.prior val))
        ::
      :-  :~  (spot:apogee spot nu-spot)                 ::  - adjust spotting
              (flow:apogee key.i.prior `val) 
          ==
      %=  state
        spot  nu-spot
        moon  (put:tick moon key.i.prior val)
      ==
    ::
        %rate                                            ::  handle add/del rate report
      =.  wen.san  (sub wen.san (mod wen.san ~d1))       ::  always midnight, sis
      =+  tock=(lunar rate)
      ?~  prior=(tab:tick moon `wen.san 1)
        =/  rote=tape
          =+  d=(yore wen.san)
          "{(scow %ud m.d)}/{(scow %ud d.t.d)}/{(scow %ud y.d)}"
        =-  [~[(note:apogee -)] state]                   ::  - fail gracefully (add rate x1)
        =,  enjs:format
        :_  (frond need-flow-start+(sect wen.san))
        """
        There is no known period to contain your flow report.
        We need a period starting before {rote} to which we can apply this.
        """
        ::
      ?~  how.san
        ?~  got=(get:tock rate.val.i.prior wen.san)
          =/  rote=tape
            =+  d=(yore wen.san)
            "{(scow %ud m.d)}/{(scow %ud d.t.d)}/{(scow %ud y.d)}"
          =-  [~[(note:apogee -)] state]                 ::  - fail gracefully (del rate)
          =,  enjs:format
          :_  (frond rate-doesnt-exist+(sect wen.san))
          """
          Could not remove the rate report from {rote}.
          No record existed for that day.
          """
          ::
        =/  val=flow
          :+  stop.val.i.prior
            +:(del:tock rate.val.i.prior wen.san)
          edit.val.i.prior
        :-  ~[(flow:apogee key.i.prior `val)]            ::  - delete a rate report
        state(moon (put:tick moon key.i.prior val))
        ::
      ?~  stop.val.i.prior
        =/  val=flow
          :+  stop.val.i.prior
            (put:tock rate.val.i.prior wen.san u.how.san)
          edit.val.i.prior
        :-  ~[(flow:apogee key.i.prior `val)]            ::  - add a rate report
        state(moon (put:tick moon key.i.prior val))
        ::
      ?:  (lte wen.san u.stop.val.i.prior)
        =/  val=flow
          :+  stop.val.i.prior
            (put:tock rate.val.i.prior wen.san u.how.san)
          edit.val.i.prior
        :-  ~[(flow:apogee key.i.prior `val)]            ::  - add a rate report (post facto)
        state(moon (put:tick moon key.i.prior val))
        ::
      =/  rote=tape
        =+  d=(yore wen.san)
        "{(scow %ud m.d)}/{(scow %ud d.t.d)}/{(scow %ud y.d)}"
      =/  start=tape
        =+  d=(yore key.i.prior)
        "{(scow %ud m.d)}/{(scow %ud d.t.d)}/{(scow %ud y.d)}"
      =/  stopt=tape
        =+  d=(yore u.stop.val.i.prior)
        "{(scow %ud m.d)}/{(scow %ud d.t.d)}/{(scow %ud y.d)}"
      =-  [~[(note:apogee -)] state]                     ::  - fail gracefully (add rate x2)
      =,  enjs:format
      :_  %-  frond
          :-  %rate-outside-flow
          a+~[(sect key.i.prior) (sect u.stop.val.i.prior)]
      """
      Your rate report for {rote} was for outside the recorded period for that time.
      We recorded your period starting on {start} and ending on {stopt}.
      """
    ::
        %spot                                            ::  handle spotting
      =.  wen.san  (sub wen.san (mod wen.san ~d1))       ::  always midnight, sis
      ?:  (~(has in spot) wen.san)
        =+  nu-spot=(~(del in spot) wen.san)
        ?:  =(spot nu-spot)  `state
        :_  state(spot nu-spot)                          ::  - del spotting
        ~[(spot:apogee spot nu-spot)]
        ::
      ?~  prior=(tab:tick moon `wen.san 1)
        =/  stahp=tape
          =+  d=(yore wen.san)
          "{(scow %ud m.d)}/{(scow %ud d.t.d)}/{(scow %ud y.d)}"
        =-  [~[(note:apogee -)] state]                   ::  - fail gracefully (spot x1)
        =,  enjs:format
        :_  (frond need-prior-flow+(sect wen.san))
        """
        There is no known cyle to contain your spotting report.
        Enter a period starting and stopping before {stahp} to continue.
        """
      ?~  stop.val.i.prior
        =/  stahp=tape
          =+  d=(yore wen.san)
          "{(scow %ud m.d)}/{(scow %ud d.t.d)}/{(scow %ud y.d)}"
        =/  start=tape
          =+  d=(yore key.i.prior)
          "{(scow %ud m.d)}/{(scow %ud d.t.d)}/{(scow %ud y.d)}"
        =-  [~[(note:apogee -)] state]                   ::  - fail gracefully (spot x2)
        =,  enjs:format
        :_  (frond need-flow-stop+(sect key.i.prior))
        """
        The cycle which would include spotting on {stahp} has no stop date.
        We need to know when your period starting on {start} stopped to continue.
        """
      ?:  (lth u.stop.val.i.prior wen.san)
        =+  nu-spot=(~(put in spot) wen.san)
        :_  state(spot nu-spot)                          ::  - add spotting
        ~[(spot:apogee spot nu-spot)]
      =/  stahp=tape
        =+  d=(yore wen.san)
        "{(scow %ud m.d)}/{(scow %ud d.t.d)}/{(scow %ud y.d)}"
      =/  start=tape
        =+  d=(yore key.i.prior)
        "{(scow %ud m.d)}/{(scow %ud d.t.d)}/{(scow %ud y.d)}"
      =/  stopt=tape
        =+  d=(yore u.stop.val.i.prior)
        "{(scow %ud m.d)}/{(scow %ud d.t.d)}/{(scow %ud y.d)}"
      =-  [~[(note:apogee -)] state]                     ::  - fail gracefully (spot x3)
      =,  enjs:format
      :_  %-  frond
          :-  %spot-inside-flow
          a+~[(sect key.i.prior) (sect u.stop.val.i.prior)]
      """
      The period recorded between {start} and {stopt} would include {stahp}.
      Adjust the end time for that period to continue.
      """
    ==
  ++  vivre
    |=  [pys=physical den=time]
    ?-    -.pys
        %temp
      `state
    ::
        %muco
      `state
    ==
  ++  petit
    |=  [pag=pregnant den=time]
    `state
  ++  pills
    |=  [con=controls den=time]
    `state
  ++  choix
    |=  [opt=election den=time]
    `state
  ++  minou
    |=  [sex=relation den=time]
    `state
  --
--