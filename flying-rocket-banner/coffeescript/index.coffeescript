class Scene
  scrollTop: 0
  constructor: (@container)->
    @entities = []
    @h = $(@container).height()
    @w = $(@container).width()
    @target =
      x: 100,
      y: 200
    
  setup: ->
    
  run: ->
    setInterval @tick, 30

  update: ->
    that = this
    
    if Math.random() > .005
      x = @w + (100 * Math.random())
      y = @h * Math.random()
      radius = 2 * Math.random()
      yellow = 255 * Math.random()
      star = new Star that, x, y, radius, radius, 'star', yellow
    
    if @entities.length > 0
      for entity in @entities
        if entity
          entity.update()
    
  tick: =>
    @update()
    
class Entity 
  vx: 0
  vy: 0
  dirY: 1
  dirX: 1
  scrollTop: 0
  constructor: (@scene, @x, @y, @w = 0, @h = 0, @classname='entity') ->
    entity = document.createElement('div')
    entity.className += @classname
    @entity = entity
    @scene.container.appendChild entity
    @scene.entities.push this
    
    
    if @scene.debug
      console.log 'added ' + @classname
    
  update: ->
    
    @dx = @x + @vx * @dirX
    @dy = @y + @vy * @dirY
    
    @x = @dx
    @y = @dy + @scene.scrollTop
    
    
    $(@entity).css({
      'width': @w + 'px'
      'height': @h + 'px'
      'top': @y + 'px'
      'left': @x + 'px' 
    })
    
  draw: ->
    
  changeDir: ( direction = x) ->
    if direction == 'x' 
      @dirX =  -@dirX
    else if direction == 'y'
      @dirY = -@dirY
    else
      console.log direction + ' is not a valid direction'
    
class Ship extends Entity
  speedX: 3
  speedY: 3
  
  update: ->
    @fly()
    super
    
    cloudPoss = Math.random()
    if cloudPoss > .3
      for i in [0..3]
        @createCloud()
    if cloudPoss > .7
      @createCloud()
    if cloudPoss > .9
      @createCloud()
  
  fly: ->
    
    
    if @x < @scene.target.x - 10
      @vx = @speedX
    else if @x > @scene.target.x + 10
      @vx = -@speedX
    else if @x >= @scene.target.x - 10 or @x <= @scene.target.x + 10
      @vx = 0
      
    if @y < @scene.target.y - 5
      @vy = @speedY
    else if @y > @scene.target.y + 5
      @vy = -@speedY   
    else if @y <= @scene.target.y + 5 or @y >= @scene.target.y - 5
      @vy = 0
      
  chanceOfChangeX: (x) ->
    chance = 0.001
    if x > @scene.w * .7 or x < @scene.w * .1
      chance = .1
    if Math.random() < chance
      return true
    return false
  
  chanceOfChangeY: (y) ->
    chance = 0.05
    if y > @scene.h *.8 or y < @scene.h * .2
      chance = 0.3
      
    if Math.random() < chance 
      return true
    return false
  
  createCloud: ->
    opac = Math.random()
    
    if Math.random() > .6
      radius = 60 * Math.random()
    else
      radius = 40 * Math.random()
      
    y = @y + @h / 4
    y += 20 * Math.random()
    if Math.random() > .5 then y *= -1
    
    cloud = new Cloud @scene, @x, y, radius, radius, opac
  
class Cloud extends Entity
  vx: -5
  constructor: (scene,x,y,w,h, @opacity) ->
    super scene, x, y, w, h, 'cloud'
    $(@entity).css('opacity', @opacity)
    @vx = @vx * Math.random() - 3
    
    #keep tabs on how many we're creating ...
    #console.log @scene.entities.length
    
  update: ->
    
    super
    @opacity -= .004
    $(@entity).css('opacity', @opacity)
    if @opacity <= 0
      @kill()
  kill: ->
    that = this
    @scene.entities[t..t] = [] if ( t = @scene.entities.indexOf(that))
     
    $(@entity).remove()
    
class Star extends Entity
  vx: -10
  
  constructor: (scene, x, y, w, h, classname, @yellowBy = 0) ->
    super scene, x, y, w, h, 'star'
    blue = @yellowBy
    $(@entity).css('background', 'rgb(255,255,' + blue + ')')
  
  update: ->
    super
    if @x < 0
      @kill()
  
  kill: ->
    that = this
    @scene.entities[t..t] = [] if ( t = @scene.entities.indexOf(that))
     
    $(@entity).remove()
      
$ ->
  scenes = []
  title = $('h1') 
  titleTop = title.css('margin-top').split('px')[0]
  
  vh = $(window).height()
  vh = if vh > 500 then vh else 500
  if vh > 700 then vh = 700
  $('#banner').css('height', vh)
  scroll_amt = 0
  dScroll = 0
  

  
  $('#banner').mousemove (e)->
    
    mouseX = e.clientX;
    mouseY = e.clientY;
    if scenes[0]
      scenes[0].target = 
        x: mouseX - 130
        y: mouseY - 120
        
  $('#banner').mouseleave ()->
    if scenes[0]
        scenes[0].target = 
          x: 200,
          y: 200
  
  $(window).on 'scroll', ()->
      scrollT = $(this).scrollTop()
      dScroll = scrollT - scroll_amt
      scroll_amt = scrollT
      
      
      
      scrollBy = (scrollT * 1.5) + parseInt(titleTop)
      opac = 1.2 - (scrollBy / (title.parent().parent().outerHeight() - 50))
     
      
      title.css({
         'margin-top': scrollBy
         'opacity': opac      
                 })
      
      if scenes[0]
        for entity in scenes[0].entities
          if entity.classname == 'star'
            entity.y -= dScroll * (.5 * entity.w)
      
  cont = document.getElementById 'banner'
  scene = new Scene cont
  scenes.push scene
  scene.run()
  
  scene.target = 
    x: 400
    y: 180
    

    
  for i in [1..200]
    x = Math.random() * scene.w
    y = Math.random() * scene.h
    radius = 2 * Math.random()
    yellow = 255 * Math.random()
      
    star = new Star scene, x, y, radius, radius, 'star', yellow
    
  ship = new Ship scene, 150, 100, 220, 80, 'shippy'
  
  setTimeout ()->
    scene.target.y = 90
  , 1000