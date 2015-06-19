class Course::AnnouncementSettings
  include ActiveModel::Model
  include ActiveModel::Conversion
  include ActiveModel::Validations

  validates :pagination, numericality: { greater_than: 0 }

  # Initialises the settings adapter
  #
  # @param [#settings] settings The settings object provided by the settings_on_rails gem.
  def initialize(settings)
    @settings = settings
  end

  # Returns the announcement pagination count
  #
  # @return [Integer] The pagination count of announcement
  def pagination
    @settings.pagination || 50
  end

  # Sets the announcement pagination number
  #
  # @param [Integer] count The new pagination count
  def pagination=(count)
    @settings.pagination = count
  end

  # Update settings with the hash attributes
  #
  # @param [Hash] attributes The hash who stores the new settings
  def update(attributes)
    attributes.each { |k, v| send("#{k}=", v) }
    valid?
  end

  def persisted? #:nodoc:
    true
  end
end
