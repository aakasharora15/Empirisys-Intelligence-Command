const fs = require('fs');

function fix(filePath) {
    let code = fs.readFileSync(filePath, 'utf8');
    
    // Find HeroSection
    const heroIdx = code.indexOf('<HeroSection');
    if (heroIdx === -1) return;
    
    // Replace the wrapper before HeroSection
    code = code.replace(
        /<div className="w-full flex flex-col pb-20 ">\n(?:<motion\.div|<div)[\s\S]*?<HeroSection/, 
        '<div className="pb-16 bg-background min-h-screen z-10 relative">\n      <HeroSection'
    );
    
    // Check if it actually replaced
    if (!code.includes('<div className="pb-16 bg-background min-h-screen z-10 relative">')) {
        console.log("Failed to replace top wrapper in " + filePath);
    }
    
    // Find the end of HeroSection
    const afterHeroIdx = code.indexOf('/>', heroIdx);
    if (afterHeroIdx === -1) return;
    
    let innerContent = "";
    if (filePath.includes('market')) innerContent = '<motion.div \n        variants={containerVariants}\n        initial="hidden"\n        animate="show"\n        className="w-full px-6 md:px-10 space-y-8 max-w-[1600px] mx-auto relative z-20"\n      >';
    else if (filePath.includes('threat')) innerContent = '<div className="space-y-6 animate-in fade-in duration-500 w-full px-6 md:px-10 max-w-[1600px] mx-auto relative z-20">';
    else innerContent = '<div className="space-y-8 max-w-[1600px] w-full mx-auto pb-10 px-6 md:px-10 relative z-20">';
    
    code = code.replace(/          <\/div>\n        }\n      \/>/, '          </div>\n        }\n      />\n\n      ' + innerContent);
    
    fs.writeFileSync(filePath, code);
    console.log("Fixed " + filePath);
}

fix('app/marketing/market-analyst/page.tsx');
fix('app/marketing/threats/page.tsx');
fix('app/marketing/lead-scoring/_components/lead-scoring-matrix.tsx');
