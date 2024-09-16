# realized this is completely unneccessary, leaving it here just in case it's not
# see NotificationType#source for what feels like a better way to load polymorphic
module Sources
  class ActiveRecordPolymorphic < GraphQL::Dataloader::Source
    def fetch(ids)
      # results in a hash { 'Articles' => query results, 'Posts' => query results, etc. }
      results = ids.filter { |obj| obj[1].present? }.group_by { |obj| obj[1] }.to_a.map { |row| [row[0], row[0].constantize.where(id: row[1].map { |pairs| pairs[0] })] }.to_h

      ids.map do |id|
        id[1].nil? ? nil : results[id[1]].detect { |record| record.id == id[0] }
      end
    end
  end
end
