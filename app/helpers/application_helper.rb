module ApplicationHelper
	def format_number(number)
	  number = number_with_delimiter("%g" % ("%.2f" % number ), :delimiter => ' ')
	end
end
