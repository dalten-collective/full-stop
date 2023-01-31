::  full-stop parser library
::
/-  *blood
::
|%
++  enjs
  =,  enjs:format
  |%
  ++  pack
    |_  [f=cord j=json]
    ++  fact
      `json`(pairs ~[type+s/'FACT' face=s/f fact+j])
    ++  scry
      `json`(pairs ~[type+s/'SCRY' face=s/f fact+j])
    --
  ++  last-edit
    |=(t=^time ~(fact pack 'LAST-RECORDED-EDIT-DATE' (sect t)))
  ++  mucosal-discharge
    |=  [p=^time [q=base r=^time] add=?]
    %~  fact  pack
    ?-    add
        %|
      ['MUCOSAL-DISCHARGE-REM' (frond when+(sect p))]
    ::
        %&
      :-  'MUCOSAL-DISCHARGE-ADD'
      %-  pairs
      ~[when+(sect p) heat+s/(scot %rd q) edit+(sect r)]
    ==
  ++  basal-temperature
    |=  [p=^time [q=base r=^time] add=?]
    %~  fact  pack
    ?-    add
        %|
      ['BASAL-TEMPERATURE-REM' (frond when+(sect p))]
    ::
        %&
      :-  'BASAL-TEMPERATURE-ADD'
      %-  pairs
      ~[when+(sect p) heat+s+(scot %rd q) edit+(sect r)]
    ==
  ++  spotting
    |=  [old=spot new=spot]
    =/  add=(list ^time)  ~(tap in (~(dif in new) old))
    =/  rem=(list ^time)
  --
++  dejs
  |%
  ++  test  'fart'
  --
++  from-json
  ~>  %bout.[0 'from-json:/lib/full-stop']
  %-  ar:dejs:format
  |=  j=json
  =,  dejs:format
  |^  ^-  [wen=^time act=activity]
    =;  act-from-jon=$-(json *)
      ?>  ?=([%o *] j)
      :-  (du (~(got by p.j) 'wen'))
      %-  activity
      %-  act-from-jon
      j(p (~(del by p.j) 'wen'))
    %-  of
    :~
    ::  sanguine  
      flow+(ot ~[wen+du])
      stop+(ot ~[wen+du])
      spot+(ot ~[wen+du])
      rate+(ot ~[how+five:soft wen+du])
      temp+(ot ~[baz+base:soft wen+du])
      muco+(ot ~[con+five:soft wen+du])
      bear+|=(* ~)
      move+(ot ~[wen+du due+bo])
    ==

  ++  soft
    |%
    ++  five
      |=  jon=json
      ^-  (unit rate)
      ?.  ?=([%n *] jon)  ~
      =+  rote=(rash p.jon dem)
      ?+  rote  ~
        %1  `%1
        %2  `%2
        %3  `%3
        %4  `%4
        %5  `%5
      ==
    ++  base
      |=  jon=json
      ^-  (unit @rs)
      ?.  ?=([%s *] jon)  ~
      %+  rush  p.jon
      %+  cook  ryls
      (cook royl-cell:^so json-rn:dejs-soft:format)
    --
  --
--