::  full-stop.
::
/-  *blood
/+  default-agent, dbug, agentio
::
|%
++  lunar  |$([a] ((on time a) gth))                    ::  mop handling core
++  cycle  |$([a] ((mop time a) gth))                   ::  mop type constructor
++  range                                               ::  standard deviation
  |=  a=(list @ud)
  ^-  [@ud @ud]                                         ::  - [avg std]
  =+  avg=(div (roll a add) (lent a))
  :-  avg
  =-  p.-  %-  sqt
  %-  div  :_  avg
  %-  roll  :_  add
  %+  roll  a
  |=  [a=@ud b=(list @ud)]
  ?:  (gth a avg)
    [(pow (sub a avg) 2) b]
  [(pow (sub avg a) 2) b]
::
+$  versioned-state  $%(state-0)
+$  state-0
  $:  %0
      =moon                                             ::  cycles
      =spot                                             ::  spotting
      =rain                                             ::  mucosal discharge
      =fire                                             ::  basal body temp
      =mate                                             ::  sexual encounters
      =bear                                             ::  pregnancy
      =hold                                             ::  birth control
      =opts                                             ::  system options
  ==
::
+$  moon  (cycle flow)                                  ::  track cycles
+$  flow                                                ::  flow includes:
  $:  stop=(unit time)                                  ::    - stop date (or not)
      rate=(cycle rate)                                 ::    - flow rate (or none)
      edit=time                                         ::    - last edit date
  ==
::
+$  spot  (set time)                                    ::  track out of cycle bleeding, loosely (no edit filtering)
+$  rain  (cycle [p=cons edit=time])                    ::  track cervical mucousal viscocity
+$  fire  (cycle [p=base edit=time])                    ::  track basal body temperature
+$  mate  (set [p=time q=(unit @t) r=?])                ::  track sexual encounters with optional details
+$  bear  (unit [star=time edit=time])                  ::  track pregnancy
+$  opts  [noti=? fert=? edit=time]                     ::  options - notifications and fertility predictions
+$  hold
  %-  unit
  $:  $=  type
      $%  [%pill h=@ud m=@ud am=? miss=(set time)]      ::  track hormonal pill b.c., record missed pills
          [%term wen=time again=time]                   ::  track implant/term b.c., record replacement date
      ==
      edit=time
  ==
+$  calm                                                ::  > calm
  $:  c=@ud                                             ::    c_ount
      a=(list @ud)                                      ::    a_verage (list)
      l=(unit ^time)                                    ::    l_ast (or none)
      m=(each @ud [^tape json])                         ::    m_aybe next, maybe not
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
  ++  on-init                                           ::  install handling
    ^-  (quip card _this)
    %-  (slog '%full-stop -online' ~)
    :_  this(state [%0 ~ ~ ~ ~ ~ ~ ~ [%.n %.n now.bowl]])
    ~[(~(connect pass /eyre) [~ /apps/full-stop/knife] %full-stop)]
  ::
  ++  on-save                                           ::  save handling
    ^-  vase
    !>(state)
  ::
  ++  on-load                                           ::  load handling
    |=  ole=vase
    ^-  (quip card _this)
    =/  old=state-0  !<(state-0 ole)
    `this(state old)
  ::
  ++  on-poke                                           ::  poke handling
    |=  [=mark =vase]
    ^-  (quip card _this)
    ?.  =(%dot-point mark)  (on-poke:def mark vase)
    =^  cards  state
      (syzygy:hc (sort !<(drop vase) dor))              ::  - respect elders
    [cards this]
  ::
  ++  on-arvo                                           :: eyre/behn handling
    |=  [=wire sign=sign-arvo]
    ^-  (quip card _this)
    ?+    wire  (on-arvo:def wire sign)
        [%eyre ~]
      ?>  ?=([%eyre %bound *] sign)
      ?:  accepted.sign  `this
      %.  `this
      (slog '%full-stop -failed-binding-eyre' ~)
    ==
  ++  on-watch                                          ::  subscription handling
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
    ::
      :-  %next
      =;  mood=(each calm json)
        ?>(?=(%.n -.mood) p.mood)
      (next:apogee:hc %.y)
    ::
      :-  %fert
      ?.  fert.opts  ~
      %-  pairs:enjs:format
      :~  rhythm+rhythm-method:fert:apogee:hc
          standard+standard-day:fert:apogee:hc
      ==
    ==
  ++  on-peek                                           ::  scry handling
    |=  pat=path
    ^-  (unit (unit cage))
    ?+    pat  (on-peek:def pat)
        [%x %all ~]                                     ::  - get front-end startup data
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
      ::
        :-  %next
        =;  mood=(each calm json)
          ?>(?=(%.n -.mood) p.mood)
        (next:apogee:hc %.y)
      ==
    ::
        [%x %moon *]                                    ::  - get moon data
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
      =;  mood=(each calm json)
        ``json+!>(`json`?>(?=(%.n -.mood) p.mood))
      (next:apogee:hc %.y)
    ::
        [%x %fert ~]
      =-  ``json+!>(`json`-)
      %-  pairs:enjs:format
      :~  standard-day+standard-day:fert:apogee:hc
          rhythm-method+rhythm-method:fert:apogee:hc
      ==
    ==
  ++  on-fail   on-fail:def
  ++  on-agent  on-agent:def
  ++  on-leave  on-leave:def
  --
|_  bol=bowl:gall
++  apogee                                              :: json output
  =,  enjs:format
  |%
  ++  note                                              ::  - send error message
    |=  [m=^tape j=json]
    (send (pairs ~[message+s+(crip m) error+j]))
  ::
  ++  send                                              ::  - send card
    |=  jon=json
    ^-  card
    [%give %fact ~[/website] json+!>(jon)]
  ::
  ++  muco                                              ::  - send mucosal diff
    |=  [p=^time [q=cons r=^time] add=?]
    ^-  card
    ?.  add
      (send (frond del-rain+(sect p)))
    %-  send  %-  frond  :-  %add-rain
    (pairs ~[when+(sect p) drip+(numb q) edit+(sect r)])
  ::
  ++  temp                                              ::  - send basal temp diff
    |=  [p=^time [q=base r=^time] add=?]
    ^-  card
    ?.  add
      (send (frond del-fire+(sect p)))
    %-  send  %-  frond  :-  %add-fire  %-  pairs
    ~[when+(sect p) heat+s+(scot %rd q) edit+(sect r)]
  ::
  ++  spot                                              ::  - send spot diff
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
  ++  flow                                              ::  - send add/del period
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
  ::  +fert: various fertility prediction methods
  ::
  ++  fert
    |%
    ::  +standard-day: predict day 8, 19 of current cycle
    ::
    ++  standard-day
      ^-  json
      =+  tick=(lunar ^flow)
      =/  mood=(each calm json)  (next %.n)
      ?>  ?=(%.y -.mood)
      ?:  (lth 6 (lent a.p.mood))
        =-  (pairs ~[message+s+(crip -.-) error++.-])   ::  fail gracefully (no average)
        :_  (frond standard-need-data+~)
        """
        The standard day method could not be calculated with the available data.
        Adding a few more cycles may help.
        """
        ::
      ?:  =-  (~(any in (silt a.p.mood)) -)
          |=(c=@ud &((lth c 26) (gth c 32)))
        =-  (pairs ~[message+s+(crip -.-) error++.-])
        :_  (frond standard-wont-work+~)                ::  fail gracefully (cycle length)
        """
        The Standard Day method works best with cycles between 26 and 32 days.
        That range doesn't apply to everyone and might not apply to you.
        %full-stop thinks your cycle is {<(div (roll a.p.mood add) (lent a.p.mood))>} days.

        If %full-stop is wrong about your cycle length, recording more cycles may help.
        Otherwise, consider checking some of our other methods, or consider
        at home hormonal testing kits, or consult with your physician.
        """
        ::
      =/  last=[k=^time v=^flow]  -:(pop:tick moon)
      ?.  (gth 32 (div (sub now.bol k.last) ~d1))
        %-  pairs                                       ::  window json
        :~  standard-start+(sect (add k.last ~d8))
            standard-stop+(sect (add k.last ~d19))
        ==
      =-  (pairs ~[message+s+(crip -.-) error++.-])
      :_  (frond standard-need-data+~)                  ::  fail gracefully (cycle length)
      """
      The Standard Day method works best with cycles between 26 and 32 days.
      That range doesn't apply to everyone and might not apply to you.
      Your last recorded period was more than 32 days ago.
      
      If %full-stop is missing data, recording more cycles may help.
      Otherwise, consider checking some of our other methods, or consider
      at home hormonal testing kits, or consult with your physician.
      """
    ::  +rhythm-method: predict fertility using formula:
    ::  x = shortest period of 6 cycles
    ::  y = longest period of 6 cycles
    ::  start fertility on (x-18)
    ::  end fertility on (y-11)
    ::
    ++  rhythm-method
      ^-  json
      =+  tick=(lunar ^flow)
      =/  mood=(each calm json)  (next %.n)
      ?>  ?=(%.y -.mood)
      ?:  (lth 6 (lent a.p.mood))
        =-  (pairs ~[message+s+(crip -.-) error++.-])   ::  fail gracefully (no average)
        :_  (frond standard-need-data+~)
        """
        The rhythm method could not be calculated.
        Adding a few more cycles may help.
        """
        ::
      ::
      ::  note: avg. variance is 2.7 ± 1.6 days
      ::  https://www.fertstert.org/article/S0015-0282(07)04138-6/fulltext
      ::
      ::  we afford a 4 day variance as maximum for safe
      ::  use of the rhythm method
      ::
      ?:  (gte +:(range a.p.mood) 4)                    ::  if > 1 std deviation
        =-  (pairs ~[message+s+(crip -.-) error++.-])   ::    fail gracefully (std. dev.)
        :_  (frond standard-wont-work+~)
        """
        The Rhythm Method works best with periods that are very regular.
        %full-stop uses a standard deviation of 2.7 ± 1.6 days as a baseline.
        %full-stop thinks your cycle's Std. Dev. is {<+(range a.p.mood)>} days.

        If %full-stop is wrong about your cycle length, recording more cycles may help.
        Otherwise, consider checking some of our other methods, or consider
        at home hormonal testing kits, or consult with your physician.
        """
      =/  last=[k=^time v=^flow]  -:(pop:tick moon)
      ?.  (gth 45 (div (sub now.bol k.last) ~d1))
        %-  pairs                                       ::    * window json
        :~  :-  %rhythm-start  %-  sect
            (add k.last (sub (head (sort a.p.mood lte)) 18))
          ::
            :-  %rhythm-stop  %-  sect
            (add k.last (sub (head (sort a.p.mood gte)) 11))
        ==
        ::
      =-  (pairs ~[message+s+(crip -.-) error++.-])
      :_  (frond standard-need-data+~)                  ::    * fail gracefully (cycle length)
      """
      The Rhythm Method works best with periods that are very regular.
      %full-stop uses a standard deviation of 2.7 ± 1.6 days as a baseline.
      %full-stop thinks your cycle's Std. Dev. is {<+(range a.p.mood)>} days.

      If %full-stop is wrong about your cycle length, recording more cycles may help.
      Otherwise, consider checking some of our other methods, or consider
      at home hormonal testing kits, or consult with your physician.
      """
    --
  ::  +next: reads through cycle history to predict next period
  ::
  ::    method:
  ::    - dip:tick will allow us to traverse the moon mop with some state
  ::    - calm (count average last [n->m]ote) is the state
  ::    - function returns [(unit val) ? calm]. On ?==true it will end
  ::      operation and produce [calm _moon]
  ::
  ::    assumptions:
  ::    - periods separated by 60 days or more are non-consecutive
  ::    - we don't need 6 consecutive periods from your most
  ::      recent, but we do need _a_ period within 45 days to 
  ::      predict your next one, based on a prior consecutive
  ::      six periods
  ::    - a six month average is statistically meaningful
  ::    - if your earnestly recorded cycle is > 45 days, on average
  ::      we apologize for the inconvenience, but we can't
  ::      predict it.
  ::
  ++  next
    |=  jason=?
    ^-  (each calm json)
    =+  tick=(lunar ^flow)
    ?~  prior=(pry:tick moon)
      =-  [%.n (pairs ~[message+s+(crip -.-) error++.-])]
      :_  (frond:enjs:format next-need-data+~)
      """
      %full-stop doesn't have enough data to predict your next period.
      Recording more back-dated cycles may help.
      """
      ::
    =;  what
      ?.  jason                                         ::  if not jason
        [%.y =,(what [c a l m])]                        ::    return calm
      ?-    -.m.what                                    ::  else, return json
          %.y
        [%.n (frond next+(numb:enjs:format p.m.what))]
      ::
          %.n
        :-  %.n
        %-  pairs
        ~[message+s+(crip -.p.m.what) error++.p.m.what]
      ==
      ::
    ^-  [calm *]
    %^    (dip:tick calm)
        moon.state
      =-  [0 ~ ~ [%.n -]]
      :_  (frond:enjs:format next-need-data+~)
      """
      %full-stop doesn't have enough data to predict your next period.
      Recording more back-dated cycles may help.
      """
    |=  $:  calm
            [k=^time v=^flow]
        ==
    ^-  [(unit ^flow) ? calm]
    ?:  (gte c 8)                                       ::  if count = 8,
      [`v %.y c a l m]                                  ::    present the avg
    ?~  l                                               ::  if first pass,
      [`v %.n +(c) a `k m]                              ::    set l = date, +(c)
    =+  cyc=`@ud`(div (sub u.l k) ~d1)
    ?:  (gte cyc 60)                                    ::  if cycle > 60 days,
      =-  [`v %.n 0 ~ `k [%.n -]]                       ::    ignore, start over
      :_  (frond:enjs:format next-lame-data+~)
      """
      %full-stop needs more consecutive, tracked periods to predict your next period.
      Recording more back-dated cycles may help.
      """
    ?:  (gte c 7)                                       ::  if cycle < 60 days,
      =-  [`v %.y +(c) a `k -]                          ::    exit and give avg
      [%.y (div (roll a add) (lent a))]
    ::  else:
    ::  - do not change the current record -> `v
    ::  - do not exit the loop -> %.n
    ::  - increment c -> +(c)
    ::  - add the recorded cycle length to a -> [cyc a]
    ::  - re-set l = date of the current record -> `k
    ::  - retain current error message -> m
    ::
    [`v %.n +(c) [cyc a] `k m]
    ::
  ::  +give: state->json
  ::
  ++  give
    |%
    ::  +moon: state->json, cycle information
    ++  moon
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
    ::  +spot: state->json, spotting dates
    ::
    ++  spot
      ^-  json
      ?.  =(~ spot.state)  ~
      :-  %a
      (turn ~(tap in spot.state) |=(wen=^time (sect wen)))
    ::  +rain: state->json, mucosal consistencies
    ::
    ++  rain
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
    ::  +fire: state->json, basal body temps
    ::
    ++  fire
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
    ::  +mate: state->json, sexual encounters
    ::
    ++  mate
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
    ::  +bear: state->json, pregnancy
    ::
    ++  bear
      ^-  json
      ?~  barr=^bear  ~
      %-  pairs
      :~  start+(sect star.u.barr)
          weeks+(numb (div (sub now.bol star.u.barr) ~d7))
          due+(sect (add star.u.barr ~d280))
          edit+(sect edit.u.barr)
      ==
    ::  +hold: state->json, birth control
    ::
    ++  hold
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
    ::  +opts: state->json, agent settings
    ::
    ++  opts
      ^-  json
      %-  pairs
      :~  noti+b+noti.^opts
          fert+b+fert.^opts
          edit+(sect edit.^opts)
      ==
    --
  --
::  +syzygy: processes a drop (list of actions)
::    - takes (list [wen=time act=activity])
::    - returns [(list card) <new state>]
::
++  syzygy
  |=  =drop
  =|  caz=(list card)
  |^
  ?~  drop  [caz state]
  =^  cards  state
    ?-    -.act.i.drop
      ?(%flow %stop %rate %spot)  (cycle-metrics i.drop)
      ?(%temp %muco)              (daily-metrics i.drop)
      ?(%bear %move)              (having-a-baby i.drop)
      ?(%pill %term %miss %free)  (birth-control i.drop)
      ?(%noti %fert)              (configuration i.drop)
      ?(%drop %mate)              (getting-it-on i.drop)
    ==
  %=    $
    drop  t.drop
    caz  (weld cards caz)
  ==
  ::
  ++  cycle-metrics
    |=  [den=time san=sanguine]
    =+  tick=(lunar flow)
    ?-    -.san
        %flow                                           ::  handle add/del period
      =.  wen.san  (sub wen.san (mod wen.san ~d1))      ::  always midnight, sis
      ?>  (gte now.bol wen.san)
      ?:  (has:tick moon wen.san)
        =/  last=flow  (got:tick moon wen.san)
        ?:  (gth edit.last den)  `state                 ::  - ignore old updates
        :-  ~[(flow:apogee wen.san ~)]                  ::  - delete an old period record
        state(moon +:(del:tick moon wen.san))
        ::
      ?~  prior=(tab:tick moon `wen.san 1)
        :-  ~[(flow:apogee wen.san [~ [~ ~ den]])]      ::  - start a period
        state(moon (put:tick moon wen.san [~ ~ den]))
        ::
      ?.  ?=(~ stop.val.i.prior)
        :-  ~[(flow:apogee wen.san [~ [~ ~ den]])]      ::  - start a period
        state(moon (put:tick moon wen.san [~ ~ den]))
        ::
      =/  last=tape
        =+  d=(yore key.i.prior)
        "{(scow %ud m.d)}/{(scow %ud d.t.d)}/{(scow %ud y.d)}"
      =-  [~[(note:apogee -)] state]                    ::  - fail elegantly
      =,  enjs:format
      :_  (frond need-flow-stop+(sect key.i.prior))
      """
      The period starting on {last} doesn't have a stop date.
      Please enter one first before entering the start of your next period.
      """
    ::
        %stop                                           ::  handle stop/adjust period
      =.  wen.san  (sub wen.san (mod wen.san ~d1))      ::  always midnight, sis
      ?>  (gte now.bol wen.san)
      =+  tock=(lunar rate)
      ?~  prior=(tab:tick moon `wen.san 1)
        =/  stop=tape
          =+  d=(yore wen.san)
          "{(scow %ud m.d)}/{(scow %ud d.t.d)}/{(scow %ud y.d)}"
        =-  [~[(note:apogee -)] state]                  ::  - fail gracefully
        =,  enjs:format
        :_  (frond need-flow-start+(sect wen.san))
        """
        There is no known period prior to {stop} to which we can apply this.
        Please enter a period starting before this stop date and resubmit.
        """
        ::
      ?:  (gth edit.val.i.prior den)  `state            ::  - ignore old updates
      ?~  stop.val.i.prior
        =/  val=flow
          :-  `wen.san  :_  den
          %+    lot:tock
              rate.val.i.prior
          [`(add wen.san ~d1) `(sub key.i.prior ~d1)]
        :-  ~[(flow:apogee key.i.prior `val)]           ::  - add a stop date
        state(moon (put:tick moon key.i.prior val))
        ::
      =/  val=flow
        :-  `wen.san  :_  den
        %+    lot:tock
            rate.val.i.prior
        [`(add wen.san ~d1) `(sub key.i.prior ~d1)]
      =/  nu-spot=(set time)                            ::  - out damned spot
        %-  sy
        %+  murn  ~(tap in spot)
        |=  t=@da
        ?:(&((lte key.i.prior t) (lte t wen.san)) ~ `t)
        ::
      ?:  =(spot nu-spot)                               ::  - adjust a stop date
        :-  ~[(flow:apogee key.i.prior `val)]
        state(moon (put:tick moon key.i.prior val))
        ::
      :-  :~  (spot:apogee spot nu-spot)                ::  - adjust spotting
              (flow:apogee key.i.prior `val) 
          ==
      %=  state
        spot  nu-spot
        moon  (put:tick moon key.i.prior val)
      ==
    ::
        %rate                                           ::  handle add/del rate report
      =.  wen.san  (sub wen.san (mod wen.san ~d1))      ::  always midnight, sis
      ?>  (gte now.bol wen.san)
      =+  tock=(lunar rate)
      =/  prior=(list [key=time val=flow])
        ?~  p=(get:tick moon wen.san)
          (tab:tick moon `wen.san 1)
        ~[[wen.san u.p]]
      ?~  prior
        =/  rote=tape
          =+  d=(yore wen.san)
          "{(scow %ud m.d)}/{(scow %ud d.t.d)}/{(scow %ud y.d)}"
        =-  [~[(note:apogee -)] state]                  ::  - fail gracefully (add rate x1)
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
          =-  [~[(note:apogee -)] state]                ::  - fail gracefully (del rate)
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
        :-  ~[(flow:apogee key.i.prior `val)]           ::  - delete a rate report
        state(moon (put:tick moon key.i.prior val))
        ::
      ?~  stop.val.i.prior
        =/  val=flow
          :+  stop.val.i.prior
            (put:tock rate.val.i.prior wen.san u.how.san)
          edit.val.i.prior
        :-  ~[(flow:apogee key.i.prior `val)]           ::  - add a rate report
        state(moon (put:tick moon key.i.prior val))
        ::
      ?:  (lte wen.san u.stop.val.i.prior)
        =/  val=flow
          :+  stop.val.i.prior
            (put:tock rate.val.i.prior wen.san u.how.san)
          edit.val.i.prior
        :-  ~[(flow:apogee key.i.prior `val)]           ::  - add a rate report (post facto)
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
      =-  [~[(note:apogee -)] state]                    ::  - fail gracefully (add rate x2)
      =,  enjs:format
      :_  %-  frond
          :-  %rate-outside-flow
          a+~[(sect key.i.prior) (sect u.stop.val.i.prior)]
      """
      Your rate report for {rote} was for outside the recorded period for that time.
      We recorded your period starting on {start} and ending on {stopt}.
      """
    ::
        %spot                                           ::  handle spotting
      =.  wen.san  (sub wen.san (mod wen.san ~d1))      ::  always midnight, sis
      ?>  (gte now.bol wen.san)
      ?:  (~(has in spot) wen.san)
        =+  nu-spot=(~(del in spot) wen.san)
        ?:  =(spot nu-spot)  `state
        :_  state(spot nu-spot)                         ::  - del spotting
        ~[(spot:apogee spot nu-spot)]
        ::
      ?~  prior=(tab:tick moon `wen.san 1)
        =/  stahp=tape
          =+  d=(yore wen.san)
          "{(scow %ud m.d)}/{(scow %ud d.t.d)}/{(scow %ud y.d)}"
        =-  [~[(note:apogee -)] state]                  ::  - fail gracefully (spot x1)
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
        =-  [~[(note:apogee -)] state]                  ::  - fail gracefully (spot x2)
        =,  enjs:format
        :_  (frond need-flow-stop+(sect key.i.prior))
        """
        The cycle which would include spotting on {stahp} has no stop date.
        We need to know when your period starting on {start} stopped to continue.
        """
      ?:  (lth u.stop.val.i.prior wen.san)
        =+  nu-spot=(~(put in spot) wen.san)
        :_  state(spot nu-spot)                         ::  - add spotting
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
      =-  [~[(note:apogee -)] state]                    ::  - fail gracefully (spot x3)
      =,  enjs:format
      :_  %-  frond
          :-  %spot-inside-flow
          a+~[(sect key.i.prior) (sect u.stop.val.i.prior)]
      """
      The period recorded between {start} and {stopt} would include {stahp}.
      Adjust the end time for that period to continue.
      """
    ==
  ++  daily-metrics
    |=  [den=time pys=physical]
    ?-    -.pys
        %temp                                           ::  handle basal body temp report
      =.  wen.pys  (sub wen.pys (mod wen.pys ~d1))      ::  always midnight, sis
      ?>  (gte now.bol wen.pys)
      =+  tick=(lunar ,[p=base edit=time])
      =/  hot=tape
        =+  d=(yore wen.pys)
        "{(scow %ud m.d)}/{(scow %ud d.t.d)}/{(scow %ud y.d)}"
      ?~  baz=baz.pys
        ?~  gat=(get:tick fire wen.pys)
          =-  [~[(note:apogee -)] state]                ::  - fail gracefully (delete)
          =,  enjs:format
          :_  (frond temp-fail-delete+(sect wen.pys))
          "We couldn't find a report on {hot} to delete."
        :-  ~[(temp:apogee wen.pys u.gat %.n)]          ::  - delete temp report
        state(fire +:(del:tick fire wen.pys))
      ?~  gat=(get:tick fire wen.pys)
        :-  ~[(temp:apogee wen.pys [u.baz den] %.y)]    ::  - add new temp report
        state(fire (put:tick fire wen.pys [u.baz den]))
      ?:  (gth edit.u.gat den)  `state                  ::  - ignore old updates
      :-  ~[(temp:apogee wen.pys [u.baz den] %.y)]      ::  - change temp report
      state(fire (put:tick fire wen.pys [u.baz den]))
    ::
        %muco                                           ::  handle mucosal consistency report
      =.  wen.pys  (sub wen.pys (mod wen.pys ~d1))      ::  always midnight, sis
      ?>  (gte now.bol wen.pys)
      =+  tick=(lunar ,[p=cons edit=time])
      =/  wap=tape
        =+  d=(yore wen.pys)
        "{(scow %ud m.d)}/{(scow %ud d.t.d)}/{(scow %ud y.d)}"
      ?~  con=con.pys
        ?~  gat=(get:tick rain wen.pys)
          =-  [~[(note:apogee -)] state]                ::  - fail gracefully (delete)
          =,  enjs:format
          :_  (frond muco-fail-delete+(sect wen.pys))
          "We couldn't find a report on {wap} to delete."
          ::
        :-  ~[(muco:apogee wen.pys u.gat %.n)]          ::  - delete muco report
        state(rain +:(del:tick rain wen.pys))
      ?~  gat=(get:tick rain wen.pys)
        :-
          ~[(muco:apogee wen.pys [u.con.pys den] %.y)]  ::  - add new muco report
        %=  state
          rain  (put:tick rain wen.pys [u.con.pys den])
        ==
      ?:  (gth edit.u.gat den)  `state                  ::  - ignore old updates
      :-  ~[(muco:apogee wen.pys [u.con.pys den] %.y)]  ::  - change muco report
      state(rain (put:tick rain wen.pys [u.con.pys den]))
    ==
  ++  having-a-baby
    |=  [den=time pag=pregnant]
    =+  tick=(lunar flow)
    ?-  -.pag
        %bear                                           ::  handle set pregnancy
      ?~  bear
        ?~  start=(pry:tick moon)
          =-  [~[(note:apogee -)] state]                ::  - fail gracefully (delete)
          =,  enjs:format
          :_  (frond bear-need-move+(sect now.bol))
          """
          We were unable to set your pregnancy's start date from our records.
          Please provide us with a start date, or due date, and we'll work from that.
          """
        ?>  (gte now.bol key.u.start)
        :_  state(bear `[key.u.start den])              ::  - set pregnant,
        :_  ~  %-  send:apogee                          ::      start last cycle
        =,  enjs:format
        %-  pairs
        :~  start+(sect key.u.start)
            due+(sect (add key.u.start ~d280))
            edit+(sect den)
        ::
          :-  %weeks
          (numb (div (sub now.bol key.u.start) ~d7))
        ==
      ?:  (gth edit.u.bear den)  `state                 ::  - ignore old updates
      :_  state(bear ~)                                 ::  - unset pregnancy
      ~[(send:apogee (frond:enjs:format bear+~))]
    ::
        %move
      =.  wen.pag  (sub wen.pag (mod wen.pag ~d1))      ::  always midnight, sis
      ?~  prior=(pry:tick moon)
        ::
        ::  if you have not added a period to the app we can take any sane
        ::  request, but will reject the following:
        ::  - due dates that are not >= today
        ::  - start dates that are < today
        ::
        ?:  due.pag
          ?:  (gte wen.pag now.bol)
            =.  bear  `[(sub wen.pag ~d280) den]
            :_  state                                   ::  - set pregnant,
            :_  ~  %-  send:apogee                      ::      start wen - 280d
            =,  enjs:format
            %-  pairs
            :~  start+(sect (sub wen.pag ~d280))
                due+(sect wen.pag)
                edit+(sect den)
            ::
              :-  %weeks
              (numb (div (sub wen.pag now.bol) ~d7))
            ==
          =-  [~[(note:apogee -)] state]                ::  - fail gracefully (set, past)
          =,  enjs:format
          :_  (frond move-stop-past+(sect wen.pag))
          """
          Our program isn't designed to set past pregnancies.
          If you meant to set your start date, or another date please re-enter it.
          """
        ?:  (gte wen.pag now.bol)
          =-  [~[(note:apogee -)] state]                ::  - fail gracefully (set, future)
          =,  enjs:format
          :_  (frond move-stop-future+(sect wen.pag))
          """
          Our program isn't designed to set future pregnancies.
          If you meant to set your due date, or another date please re-enter it.
          """
        :_  state(bear `[wen.pag den])                  ::  -set pregnant,
        :_  ~  %-  send:apogee                          ::    start wen
        =,  enjs:format
        %-  pairs
        :~  start+(sect wen.pag)
            due+(sect (add wen.pag ~d280))
            edit+(sect den)
        ::
          :-  %weeks
          (numb (div (sub wen.pag now.bol) ~d7))
        ==
        ::
      ::
      ::  if you have added periods before,
      ::  we need a data sanity check
      ::
      ?:  due.pag
        ?.  ?&  (gte wen.pag (add key.u.prior ~d140))   ::  due date >= last period + 140
                (gte wen.pag now.bol)                   ::  due date >= now
            ==
          =/  last=tape
            =+  d=(yore key.u.prior)
            "{(scow %ud m.d)}/{(scow %ud d.t.d)}/{(scow %ud y.d)}"
          =-  [~[(note:apogee -)] state]                ::  - fail gracefully (set, future)
          =,  enjs:format
          :_  %+  frond  %move-stop-period
              %-  pairs
              :~  last-period+(sect key.u.prior)
                  due-date+(sect wen.pag)
              ==  
          """
          Your due date {<last>} is within 140 days of your last recorded cycle.
          We think our data might be bad, or we're simply confused.
          If you meant to set your start date, or another date please re-enter it.
          """
        :_  state(bear `[(sub wen.pag ~d280) den])      ::  - set start by due date
        :_  ~  %-  send:apogee
        =,  enjs:format
        %-  pairs
        :~  start+(sect wen.pag)
            due+(sect (add wen.pag ~d280))
            edit+(sect den)
        ::
          :-  %weeks
          (numb (div (sub wen.pag now.bol) ~d7))
        ==
      ?.  ?&  (gte wen.pag key.u.prior)                 ::  due date >= last period + 30
              (gte now.bol wen.pag)                     ::  due date >= now
          ==
        =/  last=tape
          =+  d=(yore key.u.prior)
          "{(scow %ud m.d)}/{(scow %ud d.t.d)}/{(scow %ud y.d)}"
        =/  when=tape
          =+  d=(yore wen.pag)
          "{(scow %ud m.d)}/{(scow %ud d.t.d)}/{(scow %ud y.d)}"
        =-  [~[(note:apogee -)] state]                  ::  - fail gracefully (set, strange past)
        =,  enjs:format
        :_  %+  frond  %move-stop-period
            %-  pairs
            :~  last-period+(sect key.u.prior)
                start-date+(sect wen.pag)
            ==  
        """
        Your start date {<when>} before your last recorded cycle.
        We have your last period as starting on {<last>}.
        If you meant to set your due date, or another date please re-enter it.
        """
      :_  state(bear `[wen.pag den])                    ::  - set start date
      :_  ~  %-  send:apogee
      =,  enjs:format
      %-  pairs
      :~  start+(sect wen.pag)
          due+(sect (add wen.pag ~d280))
          edit+(sect den)
      ::
        :-  %weeks
        (numb (div (sub wen.pag now.bol) ~d7))
      ==
    ==
  ++  birth-control
    |=  [den=time con=controls]
    `state
  ++  configuration
    |=  [den=time opt=election]
    `state
  ++  getting-it-on
    |=  [den=time sex=relation]
    `state
  --
--