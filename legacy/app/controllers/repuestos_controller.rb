class RepuestosController < ApplicationController
  before_action :set_repuesto, only: [:show, :edit, :update, :destroy]

  # GET /repuestos
  # GET /repuestos.json
  def index
    @repuestos = Repuesto.all
  end

  # GET /repuestos/1
  # GET /repuestos/1.json
  def show
    @repuesto = Repuesto.find(params[:id])
    respond_to do |format|
      format.html { render :show }
      format.json { render json: @repuesto.to_json }
    end
  end


  def show_by_articulo
    @producto = Repuesto.find_by(articulo: params[:articulo])
    respond_to do |format|
      format.html { render :show }
      format.json { render json: @repuesto.to_json }
    end
  end

  # GET /repuestos/new
  def new
    @repuesto = Repuesto.new
  end

  # GET /repuestos/1/edit
  def edit
  end

  # POST /repuestos
  # POST /repuestos.json
  def create
    @repuesto = Repuesto.new(repuesto_params)

    respond_to do |format|
      if @repuesto.save
        format.html { redirect_to @repuesto, notice: 'Repuesto was successfully created.' }
        format.json { render :show, status: :created, location: @repuesto }
      else
        format.html { render :new }
        format.json { render json: @repuesto.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /repuestos/1
  # PATCH/PUT /repuestos/1.json
  def update
    respond_to do |format|
      if @repuesto.update(repuesto_params)
        format.html { redirect_to @repuesto, notice: 'Repuesto was successfully updated.' }
        format.json { render :show, status: :ok, location: @repuesto }
      else
        format.html { render :edit }
        format.json { render json: @repuesto.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /repuestos/1
  # DELETE /repuestos/1.json
  def destroy
    @repuesto.destroy
    respond_to do |format|
      format.html { redirect_to repuestos_url, notice: 'Repuesto was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_repuesto
      @repuesto = Repuesto.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def repuesto_params
      params.require(:repuesto).permit(:articulo, :precio, :id_interna, :descripcion)
    end
end
