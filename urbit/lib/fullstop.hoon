::  full-stop parser library
::
/-  *blood
::
|%
++  from-json
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