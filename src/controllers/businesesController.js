const fs = require('fs');
const path = require('path');

// Get all JSON files and merge them into one response
async function getAllJsons(req, res) {
    try {
        const jsonFolderPath = path.join(__dirname, '../jsons'); // Adjust if needed
        const files = fs.readdirSync(jsonFolderPath);
    
        let allBusinesses = [];
    
        // Load all businesses from all JSON files
        for (const file of files) {
          if (file.endsWith('.json')) {
            const filePath = path.join(jsonFolderPath, file);
            const fileData = fs.readFileSync(filePath, 'utf8');
            const jsonData = JSON.parse(fileData);
    
            // Example: {"Butare-Automotive": [ array of businesses ]}
            for (const key in jsonData) {
              if (Array.isArray(jsonData[key])) {
                allBusinesses = allBusinesses.concat(jsonData[key]);
              }
            }
          }
        }
    
        // Now analyze data
        const totalBusinesses = allBusinesses.length;
    
        const withWebsite = allBusinesses.filter(b => b.website && b.website.trim() !== '').length;
        const withLocation = allBusinesses.filter(b => b.Address && b.Address.trim() !== '').length;
        const withPhone = allBusinesses.filter(b => b.Tel && b.Tel.trim() !== '').length;
    
        // Counting by type
        const typesCount = {};
    
        for (const business of allBusinesses) {
          const typesRaw = business.Type || '';
          const types = typesRaw.split(',').map(t => t.trim()).filter(Boolean); // handle multiple types
    
          types.forEach(type => {
            if (type) {
              typesCount[type] = (typesCount[type] || 0) + 1;
            }
          });
        }
    
        // Final statistics object
        const statistics = {
          totalBusinesses,
          withWebsite,
          withLocation,
          withPhone,
          typesDistribution: typesCount,
        };
    
        return res.status(200).json({
          message: 'All JSON files fetched and analyzed successfully.',
          statistics,
          data: allBusinesses,
        });
    
      } catch (error) {
        console.error('Error reading JSON files or analyzing:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
}

module.exports = {
  getAllJsons,
};
