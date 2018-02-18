hello.init
	facebook: '1785503828138573',
	
, {redirect_uri: 'index.html'}




hello.on 'auth.login', (auth) ->
  $( "#connexion-facebook" ).remove()
  # Call user information, for the given network
  hello(auth.network).api('me').then (r) ->
    #Inject it into the container
    label = document.getElementById('profile_' + auth.network)
    if not label
      label = document.createElement('div');
      label.id = 'profile_' + auth.network;
      document.getElementById('profile').appendChild(label);
    label.innerHTML = "<img src='#{r.thumbnail}' />Hey #{r.name}"

#for DOM elements
ID = 1000

STUDENTS_LENGTH = 0
STUDENTS = {}

SELECTED_DOMS=[]
DOMAINES = {}

DATA = []
DATA_TEMP = {}

CLASSES = []
CURRENT_EVAL = {}
CURRENT_CLASSE = undefined

tuto = false 
#############################################################################################################"
class Descripteur
  constructor : (@descripteur, @item,@signifiantItem ) ->
    @id = ID++
    @html = """
<li id='#{@id}' class='descripteur' data-descripteur='#{@descripteur}' data-item='#{@item}' data-signifiant-item='#{@signifiantItem}' data-color='white'>
    <div class='head'>#{@descripteur}</div>
</li>"""   
#############################################################################################################"
class Signifiant
  constructor : (@signifiant, @item, @domaine ) ->
    @id = ID++
    @html = """
<div id='#{@id}' class='signifiant' data-item='#{@item}' data-color='white' data-signifiant='#{@signifiant}' data-domaine='#{@domaine}' data-score='0'>
    <div class='head'>
        <span class='sigtitle'>#{@signifiant}</span><button class='toggleDescripteurs black hide' data-id='#{@id}'>+/-</button> 
    </div>
    <div class='descripteurs'>
        <ul></ul>
    </div>
</div>"""
#############################################################################################################"
class Domaine
  constructor : (@domaine, @desc, @iconUrl) ->
    @id = ID++    
    @htmlTab = """
<div class='domaine__tab hide' data-id='#{@id}' data-domaine='#{@domaine}'>
    <div class='head'>
        <img class='domaine__icon' src='#{@iconUrl}'>
    </div>
</div>"""
    @html = """
<div id='#{@id}' class='domaine' data-domaine='#{@domaine}' data-description='#{@desc}' data-icon='#{@iconUrl}'>
    <div class='head'>  
        <img class='domaine__icon' src='#{@iconUrl}' data-domaine='#{@domaine}'>
     
        <div class="domDescription">
            <div class='domaine__name'>
            #{@domaine} : #{@desc}
            </div>
        </div>
    </div>
    <div class='signifiants'></div>
</div>"""
####################################################################
####################################################################
####################################################################
    
   
   
#On dom ready
$ ->
  
  window.onbeforeunload = () -> return ""  

  $.getJSON "S4C_cat.json", ( data ) -> 
      DOMAINES = data
      for nom of DOMAINES
        CURRENT_EVAL[nom] = {}
        dom = new Domaine(nom, data[nom].description, data[nom].iconUrl)
        $( "#tabs" ).append dom.htmlTab
        $( "#domaines_area" ).append dom.html   
        i=1
        for signifiant, descripteurs of data[nom].signifiants
          sig = new Signifiant(signifiant, "#{nom}.#{i++}", dom.domaine)
          $( ".domaine[data-domaine='#{sig.domaine}']" ).find( ".signifiants" ).append sig.html
          j=1
          for descripteur in descripteurs
            des = new Descripteur(descripteur, "#{sig.item}.#{j++}",sig.item)
            $( ".signifiant[data-item='#{sig.item}'] .descripteurs ul" ).append des.html     
      $( "#edit" ).prop "checked", false      
      $( ".toggleDescripteurs" ).click()      
      $( ".domaine" ).hide()
##################################################################
     
  $( "body" ).on "click", ".domaine__tab", (event) ->
    id = $(this).data( "id" )
    $(this).toggleClass "show hide"
    if $(this).hasClass "show"
      $( "##{id}" ).show()
    else
      $( "##{id}" ).hide()

 
  ##################################################################
  #Evt : Quand on toggle un signifiant   
  ##################################################################
  #Toggle signifiant
  toggleSignifiant = (id) ->
    $signifiant    = $( "##{id}" )
    item  = $signifiant.data "item"
    dom   = $signifiant.data "domaine"
    color = $signifiant.data "color"

    switch color
      when "white"      then [color, score] = ["shaded", 0]
      when "shaded"     then [color, score] = ["red", 10]
      when "red"        then [color, score] = ["yellow", 25]
      when "yellow"     then [color, score] = ["lightGreen", 40]
      when "lightGreen" then [color, score] = ["green", 50]
      when "green"
        if $( "#simplify" ).hasClass "show"
          [color, score] = ["shaded", 0]
        else
          [color, score] = ["white", 0]
    
    $signifiant.attr( "data-color", color )
    $signifiant.data( "color", color )
    
    $signifiant.attr( "data-score", score )
    $signifiant.data( "score", score )
    
    total = 0
    $( ".signifiant:not([data-color='white'])" ).each ->
      total += parseInt( $( this ).attr( "data-score" ), 10 )
    
    nb = $( ".signifiant:not([data-color='white'])" ).length
    select = $( ".signifiant:not([data-score='0'])" ).length
    note_overall = Math.round(total*20/(nb*50))
    
    if select is NaN
      note_select = 0
    else
      note_select = Math.round(total*20/(select*50))
    $( "#note_overall" ).html "Global : #{total}/#{nb*50} soit #{note_overall}/20 | "
    $( "#note_select" ).html "Évalué : #{total}/#{select*50} soit #{note_select}/20"
      
    
    
    
        
   
            
  $( "body" ).on "click", ".signifiant", ->
    id = $( this ).attr "id"
    toggleSignifiant( id )
    
  ##################################################################
#Evt : Quand on toggle les descripteurs ##################################################################         
  $( "body" ).on "click", ".toggleDescripteurs", (event) ->
    event.stopPropagation()
    id = $(this).data "id"
    $( this ).toggleClass "hide show"
    $( "##{id} .descripteurs" ).toggle()
    
  $( "body" ).on "click", "#simplify", (event) ->
    console.log "helo"
    $( ".signifiant[data-color='white']" ).toggleClass "simplify"
    
  $( "#student" ).on "change", ->
    $('head title', window.parent.document).text $(this).val()
    
  
  
  











